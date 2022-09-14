import { anyPass, has } from 'ramda'
import React from 'react'
import { Nil, Primitive } from './types'

export const isNil = (x: unknown): x is Nil => x == null
export const isNilOrZero = (x: unknown): x is Nil | 0 => x == null || x === 0
export const isNilOrEmpty = (x: unknown): x is Nil | '' => x == null || x === ''
export const isNilOrWhitespace = (x: unknown): x is Nil | '' => x == null || (isString(x) && x.trim() === '')
export const isWhitespace = (x: string): x is '' => x.trim() === ''

export const isBoolean = (x: unknown): x is boolean => typeof x == 'boolean'
export const isFunction = (x: unknown) => typeof x === 'function'
export const isNumber = (x: unknown): x is number => typeof x === 'number'
export const isString = (x: unknown): x is string => typeof x === 'string' || x instanceof String
export const isArray = (x: unknown): x is unknown[] => Array.isArray(x)
export const isEmptyArray = (x: unknown): x is unknown[] => isArray(x) && x.length == 0

export const isTemplateStringsArray = (x: unknown): x is TemplateStringsArray => has('raw')(x)
export const isPrimitive = (x: unknown): x is Primitive => anyPass([isNil, isBoolean, isNumber, isString])(x)

export const isClassComponent = (component: unknown) => typeof component === 'function' && !!component.prototype.isReactComponent
export const isFunctionComponent = (component: unknown) =>
  typeof component === 'function' && String(component).includes('return React.createElement')
export const isReactComponent = (component: unknown) => isClassComponent(component) || isFunctionComponent(component)
export const isElement = (element: any) => React.isValidElement(element)
export const isDOMTypeElement = (element: any) => isElement(element) && typeof element.type === 'string'
export const isCompositeTypeElement = (element: any) => isElement(element) && typeof element.type === 'function'

export const keys = (x: object) => Object.keys(x)

export type Email = string
export const isEmail = (x: string | undefined): x is Email =>
  x == null
    ? false
    : String(x)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ) != null

export const shallowCompare = (obj1: any, obj2: any) =>
  Object.keys(obj1).length === Object.keys(obj2).length && Object.keys(obj1).every(key => obj1[key] === obj2[key])

export const prefersDarkMode = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
export const isServer = () => typeof window === 'undefined'

const reactPropsRegex =
  /^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|download|draggable|encType|enterKeyHint|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/ // https://esbench.com/bench/5bfee68a4cd7e6009ef61d23

export const isValidHtmlProp = (prop: string) => {
  return (
    reactPropsRegex.test(prop) ||
    (prop.charCodeAt(0) === 111 &&
      /* o */
      prop.charCodeAt(1) === 110 &&
      /* n */
      prop.charCodeAt(2) < 91)
  )
}
