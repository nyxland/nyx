import IModule from '../interfaces/Module.js';

export const io: IModule = {
  println(message: any) {
    console.log(message);
  }
};
