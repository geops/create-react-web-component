import React, { FC, Component, ReactNode, ComponentClass, CSSProperties } from 'react';
import Style from 'style-it';

interface IStyled {
  styles: CSSProperties;
  children: ReactNode | ReactNode[];
}

/**
 * Wrapper component for exposing styles
 * @param props React props - contains styles to be injected
 */
const Styled: FC<IStyled> = (props): JSX.Element => {
  const styles = props.styles.toString();
  const formattedStyles = stripCommentsAndSelectors(styles);
  const withFallbacks = addVariableFallbacks(formattedStyles);

  return Style.it(withFallbacks, props.children);
};

/**
 * HOC for exposing styles
 * Can be used instead of <Styled> wrapper component
 * @param styles styles to be injected
 */
const withStyles = (styles: CSSProperties) => <P, S>(WrappedComponent: ComponentClass<P, S> | FC<P>) => {
  return class extends Component<P, S> {
    public render() {
      return (
        <Styled styles={styles}>
          <div>
            {/* @ts-ignore */}
            <WrappedComponent {...(this.props as P)} />
          </div>
        </Styled>
      );
    }
  };
};

/**
 * Strips away warning comment at the top
 * @param styles styles to strip comments from
 */
export const stripCommentsAndSelectors = (styles: string): string => {
  const placeholderComment = `
    /*
    * -
    */
  `;

  const stylesWithoutComments = styles.replace(
    /\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/gm,
    placeholderComment,
  );

  return stylesWithoutComments;
};

/**
 * Adds css variable fallback for legacy browsers
 * @param styles styles to add fallback to
 */
export const addVariableFallbacks = (styles: string): string => {
  const stylesWithoutRootSelector = styles.replace(/:root/g, '');
  const variableMap = new Map();
  const originalCssLines = stylesWithoutRootSelector.split('\n');
  const newCssLines: string[] = [];

  originalCssLines.forEach((cssLine: string) => {
    if (cssLine.trim().substring(0, 2) === '--') {
      const keyValueSplit = cssLine.trim().split(':');
      variableMap.set(keyValueSplit[0], keyValueSplit[1].replace(';', ''));
    }
  });

  originalCssLines.forEach((cssLine: string) => {
    if (cssLine.includes('var')) {
      const lineWithoutSemiColon = cssLine.replace(';', '');
      const varName = lineWithoutSemiColon.substring(
        lineWithoutSemiColon.indexOf('var(') + 4,
        lineWithoutSemiColon.length - 1,
      );

      const varValue = variableMap.get(varName);
      const lineWithValue = `${lineWithoutSemiColon.replace(`var(${varName})`, varValue)};`;

      newCssLines.push(lineWithValue);
    }

    newCssLines.push(cssLine);
  });

  return newCssLines.join('\n');
};

export { withStyles, Styled };
