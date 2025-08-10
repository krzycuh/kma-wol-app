import wol from 'wake_on_lan';
import { exec } from 'child_process';
import { Client as SshClient } from 'ssh2';
import { COMPUTERS } from '../config';
import { getQueryParam } from '../utils/urlParser';
import { ControllerResult, SuccessObject, SuccessMessage, Error } from '../utils/ControllerResult';
import { logComputerEvent, getComputerLogs } from '../utils/logger';

export function getComputers(): ControllerResult {
  // Zwracamy obiekty komputerów bez wrażliwych danych jak MAC adresy
  const safeComputers = COMPUTERS.map(c => ({
    name: c.name,
    id: c.name, // Używamy nazwy jako ID
    ...(c.ip && { ip: c.ip }), // Dodaj IP jeśli dostępny
    // Można dodać inne bezpieczne dane w przyszłości
    // np. location, description, type, etc.
  }));
  return new SuccessObject(safeComputers);
}

export function wakeComputer(url: string, user: string): Promise<ControllerResult> {
  return new Promise((resolve) => {
    const computerId = getQueryParam(url, 'computer');
    if (!computerId) {
      resolve(new Error('Nieprawidłowy komputer', 400));
      return;
    }
    
    const computer = COMPUTERS.find(c => c.name === computerId || c.mac === computerId);
    
    if (!computer) {
      resolve(new Error('Nieprawidłowy komputer', 400));
      return;
    }

    wol.wake(computer.mac, { address: '255.255.255.255', port: 9 }, async (err: Error | null) => {
      if (err) {
        console.error(new Date().toISOString(), '[', user, ']', 'Błąd WoL:', err);
        await logComputerEvent(computer.name, {
          user,
          action: 'wake',
          status: 'error',
          message: 'Błąd wysłania WoL'
        });
        resolve(new Error('Błąd wysłania Wake-on-LAN'));
      } else {
        console.log(new Date().toISOString(), '[', user, ']', `Wysłano WoL do ${computer.mac} (${computer.name}) przez użytkownika: ${user}`);
        await logComputerEvent(computer.name, {
          user,
          action: 'wake',
          status: 'success',
          message: 'Wysłano WoL'
        });
        resolve(new SuccessMessage(`Wysłano magiczny pakiet WoL do ${computer.name} przez użytkownika: ${user}`));
      }
    });
  });
}

export function pingComputer(url: string, user: string): Promise<ControllerResult> {
  return new Promise((resolve) => {
    const computerId = getQueryParam(url, 'computer');
    if (!computerId) {
      resolve(new Error('Nieprawidłowy komputer', 400));
      return;
    }
    
    const computer = COMPUTERS.find(c => c.name === computerId || c.mac === computerId);
    
    if (!computer) {
      resolve(new Error('Nieprawidłowy komputer', 400));
      return;
    }

    // Sprawdź czy komputer ma adres IP
    if (!computer.ip) {
      resolve(new Error('Komputer nie ma skonfigurowanego adresu IP', 400));
      return;
    }

    // Wykryj system operacyjny dla odpowiedniej komendy ping
    const isWindows = process.platform === 'win32';
    const pingCmd = isWindows 
      ? `ping -n 1 -w 3000 ${computer.ip}` 
      : `ping -c 1 -W 3 ${computer.ip}`;

    console.log(new Date().toISOString(), '[', user, ']', `Sprawdzanie dostępności ${computer.name} (${computer.ip})`);

    exec(pingCmd, async (error) => {
      if (error) {
        console.log(new Date().toISOString(), '[', user, ']', `${computer.name} (${computer.ip}) - OFFLINE`);
        await logComputerEvent(computer.name, {
          user,
          action: 'ping',
          status: 'offline',
          message: 'Host niedostępny'
        });
        resolve(new SuccessObject({ 
          computer: computer.name, 
          ip: computer.ip, 
          status: 'offline',
          message: `${computer.name} jest niedostępny`
        }));
      } else {
        console.log(new Date().toISOString(), '[', user, ']', `${computer.name} (${computer.ip}) - ONLINE`);
        await logComputerEvent(computer.name, {
          user,
          action: 'ping',
          status: 'online',
          message: 'Host dostępny'
        });
        resolve(new SuccessObject({ 
          computer: computer.name, 
          ip: computer.ip, 
          status: 'online',
          message: `${computer.name} jest dostępny`
        }));
      }
    });
  });
} 

export function shutdownComputer(url: string, user: string): Promise<ControllerResult> {
  return new Promise((resolve) => {
    const computerId = getQueryParam(url, 'computer');
    if (!computerId) {
      resolve(new Error('Nieprawidłowy komputer', 400));
      return;
    }

    const computer = COMPUTERS.find(c => c.name === computerId || c.mac === computerId);
    if (!computer) {
      resolve(new Error('Nieprawidłowy komputer', 400));
      return;
    }

    if (!computer.ip) {
      resolve(new Error('Komputer nie ma skonfigurowanego adresu IP', 400));
      return;
    }

    const username = computer.sshUsername;
    const password = computer.sshPassword;
    if (!username || !password) {
      resolve(new Error('Brak konfiguracji SSH dla komputera (sshUsername/sshPassword)', 400));
      return;
    }

    console.log(new Date().toISOString(), '[', user, ']', `Żądanie wyłączenia komputera ${computer.name}`);

    const conn = new SshClient();
    let commandExecuted = false;

    conn
      .on('ready', () => {
        conn.exec('shutdown /s /t 0', (err: unknown, stream: any) => {
          if (err) {
            console.error(new Date().toISOString(), '[', user, ']', `Błąd exec na ${computer.name}:`, err);
            conn.end();
            resolve(new Error('Błąd wyłączania komputera'));
            return;
          }
          
          commandExecuted = true;
          console.log(new Date().toISOString(), '[', user, ']', `Wysłano polecenie wyłączenia do komputera ${computer.name}`);
          
          // Zakończ połączenie natychmiast po wysłaniu komendy
          conn.end();
          
          logComputerEvent(computer.name, {
            user,
            action: 'shutdown',
            status: 'success',
            message: 'Wysłano shutdown'
          });
          resolve(new SuccessMessage(`Wysłano polecenie wyłączenia do komputera ${computer.name}`));
        });
      })
      .on('error', (_e: unknown) => {
        if (!commandExecuted) {
          console.error(new Date().toISOString(), '[', user, ']', `Błąd połączenia SSH z ${computer.name}`);
          logComputerEvent(computer.name, {
            user,
            action: 'shutdown',
            status: 'error',
            message: 'Błąd połączenia SSH'
          });
          resolve(new Error('Błąd połączenia SSH'));
        }
        // Jeśli komenda została już wykonana, ignoruj błąd (normalny przy shutdown)
      })
      .connect({
        host: computer.ip,
        port: 22,
        username,
        password,
        readyTimeout: 5000  // Krótszy timeout
      });
  });
}

export function getComputerLogsController(url: string, user: string): Promise<ControllerResult> {
  return new Promise(async (resolve) => {
    const computerId = getQueryParam(url, 'computer');
    if (!computerId) {
      resolve(new Error('Nieprawidłowy komputer', 400));
      return;
    }
    
    const computer = COMPUTERS.find(c => c.name === computerId || c.mac === computerId);
    if (!computer) {
      resolve(new Error('Nieprawidłowy komputer', 400));
      return;
    }

    const limitParam = getQueryParam(url, 'limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 10;
    
    if (isNaN(limit) || limit < 1 || limit > 100) {
      resolve(new Error('Nieprawidłowy limit (1-100)', 400));
      return;
    }

    try {
      const logs = await getComputerLogs(computer.name, limit);
      resolve(new SuccessObject(logs));
    } catch (err) {
      console.error(new Date().toISOString(), '[', user, ']', `Błąd pobierania logów dla ${computer.name}:`, err);
      resolve(new Error('Błąd pobierania logów'));
    }
  });
}