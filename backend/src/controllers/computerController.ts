import wol from 'wake_on_lan';
import { exec } from 'child_process';
import { COMPUTERS } from '../config';
import { getQueryParam } from '../utils/urlParser';
import { ControllerResult, SuccessObject, SuccessMessage, Error } from '../utils/ControllerResult';

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

    wol.wake(computer.mac, { address: '255.255.255.255', port: 9 }, (err: Error | null) => {
      if (err) {
        console.error(new Date().toISOString(), '[', user, ']', 'Błąd WoL:', err);
        resolve(new Error('Błąd wysłania Wake-on-LAN'));
      } else {
        console.log(new Date().toISOString(), '[', user, ']', `Wysłano WoL do ${computer.mac} (${computer.name}) przez użytkownika: ${user}`);
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

    exec(pingCmd, (error, stdout, stderr) => {
      if (error) {
        console.log(new Date().toISOString(), '[', user, ']', `${computer.name} (${computer.ip}) - OFFLINE`);
        resolve(new SuccessObject({ 
          computer: computer.name, 
          ip: computer.ip, 
          status: 'offline',
          message: `${computer.name} jest niedostępny`
        }));
      } else {
        console.log(new Date().toISOString(), '[', user, ']', `${computer.name} (${computer.ip}) - ONLINE`);
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