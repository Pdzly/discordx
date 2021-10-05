import { DependencyContainer } from "tsyringe";
import { InstanceOf } from "../..";

/**
 * It create on instance of a classe and store it globally using
 * the singleton design pattern
 * @category Internal
 */
export class DIService {
  private static _instance: DIService;
  private static _container?: DependencyContainer;

  static get container(): DependencyContainer | undefined {
    return this._container;
  }

  static set container(container: DependencyContainer | undefined) {
    this._container = container;
  }

  static get instance(): DIService {
    if (!this._instance) {
      this._instance = new DIService();
    }
    return this._instance;
  }

  private _services = new Map();

  addService<T>(classType: T): void {
    const myClass = classType as unknown as new () => InstanceOf<T>;
    if (DIService.container) {
      DIService.container.registerSingleton(myClass);
    } else {
      const instance = new myClass();
      this._services.set(classType, instance);
    }
  }

  getService<T extends unknown>(classType: T): InstanceOf<T> {
    const myClass = classType as unknown as new () => InstanceOf<T>;
    if (DIService.container) {
      return DIService.container.resolve(myClass) as InstanceOf<T>;
    }
    return this._services.get(classType);
  }
}
