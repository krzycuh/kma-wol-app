import { ControllerResult, SuccessObject } from '../utils/ControllerResult';

export function getUserInfo(user: string): ControllerResult {
  return new SuccessObject({ name: user });
} 