import React from 'react';
import { Root, createRoot, hydrateRoot } from 'react-dom/client';
import { createProxy } from 'react-shadow';
import { EventProvider } from '../EventContext/EventContext';

let componentAttributes: any;
let componentProperties: any;
let rootComponent: React.FC<any> | React.ComponentClass<any, any>;
let shadow: boolean | undefined;

export const setComponentAttributes = (attributes: any) => {
  componentAttributes = attributes;
};

export const setComponentProperties = (properties: any) => {
  componentProperties = properties;
};

export const setRootComponent = (component: React.FC<any> | React.ComponentClass<any, any>) => {
  rootComponent = component;
};

export const setMode = (shadowOption: boolean) => {
  shadow = shadowOption;
};

class CustomComponent extends HTMLElement {
  root?: Root;

  public static get observedAttributes() {
    return Object.keys(componentAttributes).map((k) => k.toLowerCase());
  }

  private reactProps(): any {
    const attributes = {} as any;

    Object.keys(componentAttributes).forEach((key: string) => {
      attributes[key] = this.getAttribute(key) || (componentAttributes as any)[key];
    });

    return { ...attributes, ...componentProperties };
  }

  public connectedCallback() {
    this.mount();
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) {
      return;
    }

    this.update();
  }

  public reactPropsChangedCallback(name: string, oldValue: any, newValue: any) {
    if (oldValue === newValue) {
      return;
    }

    componentProperties[name] = newValue;

    this.update();
  }

  public disconnectedCallback() {
    this.unmount();
  }

  private mount() {
    if (!this.root) {      
      this.root = createRoot(this);
    }
    this.update();
  }

  private update() {
    let application = (
      <EventProvider value={this.eventDispatcher}>
        {React.createElement(rootComponent, this.reactProps())}
      </EventProvider>
    );

    if (shadow) {
      // @ts-ignore
      const root = createProxy({ div: undefined });
      application = (<root.div>{application}</root.div>);
    }

    this.root?.render(application);
  }
  private unmount() {
    if (!this.root) {      
      this.root = createRoot(this);
    }
    this.update();
  }

  private eventDispatcher = (event: Event) => {
    this.dispatchEvent(event);
  };
}

export default CustomComponent;
