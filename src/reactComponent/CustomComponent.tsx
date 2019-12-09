import React from 'react';
import ReactDOM from 'react-dom';
import { createProxy } from 'react-shadow';
import { EventProvider } from '../components/EventContext';

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
    this.mountReactApp();
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) {
      return;
    }

    this.mountReactApp();
  }

  public reactPropsChangedCallback(name: string, oldValue: any, newValue: any) {
    if (oldValue === newValue) {
      return;
    }

    componentProperties[name] = newValue;

    this.mountReactApp();
  }

  public disconnectedCallback() {
    ReactDOM.unmountComponentAtNode(this);
  }

  private mountReactApp() {
    const application = (
      <EventProvider value={this.eventDispatcher}>
        {React.createElement(rootComponent, this.reactProps())}
      </EventProvider>
    );

    if (shadow !== undefined && !shadow) {
      ReactDOM.render(application, this);
    } else {
      const root = createProxy({ div: undefined });
      ReactDOM.render(<root.div>{application}</root.div>, this);
    }
  }

  private eventDispatcher = (event: Event) => {
    this.dispatchEvent(event);
  };
}

export default CustomComponent;
