import wol from 'wake_on_lan';
import { COMPUTERS } from '../config';
import { getQueryParam } from '../utils/urlParser';
import { ControllerResult, SuccessObject, SuccessMessage, Error } from '../utils/ControllerResult';

export function getComputers(): ControllerResult {
  // Zwracamy obiekty komputerów bez wrażliwych danych jak MAC adresy
  const safeComputers = COMPUTERS.map(c => ({
    name: c.name,
    id: c.name, // Używamy nazwy jako ID
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

    wol.wake(computer.mac, { address: '255.255.255.255' }, (err: Error | null) => {
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