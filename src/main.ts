import { flatten, includes } from 'ramda'
import to from 'tailwind-override'
import React, { createElement, ReactHTML } from 'react'
import { isArray, isFunction, isPrimitive, isString, isTemplateStringsArray, isValidHtmlProp } from './functions'
import { Primitive } from './types'
const overrideTailwindClasses = to.overrideTailwindClasses

const tags: HtmlElementName[] = [
  'a',
  'abbr',
  'address',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'base',
  'bdi',
  'bdo',
  'big',
  'blockquote',
  'body',
  'br',
  'button',
  'canvas',
  'caption',
  'cite',
  'code',
  'col',
  'colgroup',
  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'div',
  'dl',
  'dt',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hgroup',
  'hr',
  'html',
  'i',
  'iframe',
  'img',
  'input',
  'ins',
  'kbd',
  'keygen',
  'label',
  'legend',
  'li',
  'link',
  'main',
  'map',
  'mark',
  'menu',
  'menuitem',
  'meta',
  'meter',
  'nav',
  'noscript',
  'object',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'param',
  'picture',
  'pre',
  'progress',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'script',
  'section',
  'select',
  'small',
  'source',
  'span',
  'strong',
  'style',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'title',
  'tr',
  'track',
  'u',
  'ul',
  'var',
  'video',
  'wbr',

  // SVG
  // 'circle',
  // 'clipPath',
  // 'defs',
  // 'ellipse',
  // 'foreignObject',
  // 'g',
  // 'image',
  // 'line',
  // 'linearGradient',
  // 'mask',
  // 'path',
  // 'pattern',
  // 'polygon',
  // 'polyline',
  // 'radialGradient',
  // 'rect',
  // 'stop',
  // 'svg',
  // 'text',
  // 'tspan',
]

export type HtmlTag = keyof ReactHTML
export interface AnyProps {
  [key: string]: unknown
}

export interface ClassNameProp {
  className?: string
}

export interface AdornComponentProps {
  adorn?: Primitive | Primitive[] // TO DO
  //as?: HtmlElementName // TO DO
}

type HtmlElementName = keyof ReactHTML

export type Function<UsersCustomProps> = (props: UsersCustomProps) => Primitive | Primitive[]
export type ClassValue<UsersCustomProps> = Primitive | Function<UsersCustomProps>

type StylableHtmlElements = {
  [Property in HtmlElementName]: <UserCustomProps>(
    firstArg: TemplateStringsArray | ClassValue<UserCustomProps> | ClassValue<UserCustomProps>[],
    ...otherArgs: ClassValue<UserCustomProps>[]
  ) => (props: JSX.IntrinsicElements[Property] & UserCustomProps & AdornComponentProps) => JSX.Element
}

type StyleComponent = <ComponentProps extends ClassNameProp>(
  component: React.FC<ComponentProps>,
  unpermittedPropNames?: string[]
) => <UserCustomProps>(
  firstArg: TemplateStringsArray | ClassValue<UserCustomProps> | ClassValue<UserCustomProps>[],
  ...otherArgs: ClassValue<UserCustomProps>[]
) => React.ForwardRefExoticComponent<React.PropsWithoutRef<ComponentProps & UserCustomProps> & React.RefAttributes<unknown>>

export type Adorn = StyleComponent & StylableHtmlElements

const joinTaggedTemplateArguments = <UserCustomProps>(
  strings: TemplateStringsArray,
  ...values: ClassValue<UserCustomProps>[]
) => {
  let arr: ClassValue<UserCustomProps>[] = []
  strings.forEach((string, i) => {
    if (string != null && string.trim() != '') arr.push(string.trim())
    if (values[i] != null && values[i] != '') arr.push(values[i])
  })
  return arr
}

const flattenClassValues = <UserCustomProps>(
  firstArg: TemplateStringsArray | ClassValue<UserCustomProps> | ClassValue<UserCustomProps>[],
  ...otherArgs: ClassValue<UserCustomProps>[]
): ClassValue<UserCustomProps>[] => {
  //NOTE: otherArgs will always be an array, if no parameters are passed, it will be an empty array

  //if function is called as tagged template, merge the two arguments into a single array, flatten and return
  const functionIsCalledAsTaggedTemplate = isArray(firstArg) && isTemplateStringsArray(firstArg)
  if (functionIsCalledAsTaggedTemplate) {
    const taggedTemplateValues = joinTaggedTemplateArguments(firstArg, ...otherArgs)
    return flatten(taggedTemplateValues)
  }

  //if firstArg is a primitive or function
  //return array with firstArg followed by flattened and spread otherArgs
  if (isPrimitive(firstArg) || isFunction(firstArg)) return [firstArg as ClassValue<UserCustomProps>, ...flatten(otherArgs)]

  //if firstArg is an array, flatten both arguments and spread them into array
  if (isArray(firstArg)) return [...flatten(firstArg), ...flatten(otherArgs)]

  return [] as ClassValue<UserCustomProps>[]
}

const flatClassValueArgToStr =
  <Props>(props: Props) =>
  (flatClassValuesArr: ClassValue<Props>[]): string => {
    const fulfilledClassValuesArr = flatClassValuesArr.map(fullfilClassValue(props))
    const onlyStringClassValuesArr = fulfilledClassValuesArr.filter(isString)
    const stringClassValue = onlyStringClassValuesArr.join(' ')
    const classNameGroup = overrideTailwindClasses(stringClassValue)
    return classNameGroup
  }

const fullfilClassValue =
  <Props>(props: Props) =>
  (value: ClassValue<Props>, index: number, array: ClassValue<Props>[]) => {
    if (isFunction(value)) {
      const fulfilledValue = (value as Function<Props>)(props)
      return fulfilledValue
    }
    return value
  }

const onlyValidProps = <Props extends { [key: string]: any }>(props: Props) => {
  const newProps: AnyProps = {}
  const propNames = Object.keys(props)
  propNames.forEach(propName => {
    if (isValidHtmlProp(propName)) newProps[propName] = props[propName]
  })
  return newProps
}

const isUnpermittedProp = (propNames: string[]) => (key: string) => includes(key, propNames)

const withoutUnpermittedProps =
  (propNames: string[]) =>
  <T extends { [key: string]: unknown }>(props: T) => {
    return Object.keys(props).reduce(
      (obj, key) => (isUnpermittedProp(propNames)(key) ? obj : { ...obj, [key]: (props as any)[key] }),
      {}
    )
  }

export const styleComponent: StyleComponent =
  <ComponentProps extends ClassNameProp>(component: React.FC<ComponentProps>, unpermittedPropNames: string[] = []) =>
  <UserCustomProps>(
    firstArg: TemplateStringsArray | ClassValue<UserCustomProps> | ClassValue<UserCustomProps>[],
    ...otherArgs: ClassValue<UserCustomProps>[]
  ) => {
    type Props = ComponentProps & UserCustomProps
    const newcomponent = (p: Props, ref: any) => {
      const flatClassValuesArr = flattenClassValues(firstArg, ...otherArgs, p.className)
      const className = flatClassValueArgToStr(p)(flatClassValuesArr)
      const props = { ...(p as any), ref, className }
      const el = createElement(component, withoutUnpermittedProps(unpermittedPropNames)(props) as any)
      return el
    }
    newcomponent.displayName = `adorn.${component?.displayName}`

    const forwardedComponent = React.forwardRef(newcomponent)
    return forwardedComponent
  }

const adornPropToFlatClassValueArg = (val: Primitive | Primitive[]) => {
  if (isPrimitive(val)) return [val]
  return flatten(val)
}

tags.forEach(tagName => {
  ;(styleComponent as any)[tagName] = <UserCustomProps>(
    firstArg: TemplateStringsArray | ClassValue<UserCustomProps> | ClassValue<UserCustomProps>[],
    ...otherArgs: ClassValue<UserCustomProps>[]
  ) => {
    type Props = UserCustomProps & ClassNameProp & AdornComponentProps
    const component = (p: Props, ref: any) => {
      const flatClassValuesArrFromArg = flattenClassValues(firstArg, ...otherArgs, p.className)
      const classNameGroupFromArgs = flatClassValueArgToStr(p)(flatClassValuesArrFromArg)
      const flatClassValuesArrFromProp = adornPropToFlatClassValueArg(p.adorn)
      const classNameGroupFromProp = flatClassValueArgToStr(p)(flatClassValuesArrFromProp)
      const className = `${classNameGroupFromArgs} ${classNameGroupFromProp}`
      return createElement(tagName, onlyValidProps({ ...p, ref, className }))
    }
    component.displayName = `adorn.${tagName}`
    return React.forwardRef(component)
  }
})

export const adorn = styleComponent as Adorn
