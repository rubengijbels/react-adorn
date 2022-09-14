# react-adorn

This library lets React developers style html elements or components exposing a className prop in a [styled-components](https://styled-components.com/)-like manner, but instead of writing css-in-js, we just use classNames. It is meant to be used in combination with a css utility library like [Tailwindcss](https://tailwindcss.com/), but can also be used with your own css classnames.

## Install

`npm i react-adorn`

or

`yarn add react-adorn`

## Basic use

```jsx
import { adorn } from 'react-adorn'

const Container = adorn.div`p-5 my-5 border bg-slate-100`
const Title = adorn.h2`text-xl text-slate-800 mb-2`
// or if you prefer this syntax
const Paragraph = adorn.p('text-md text-slate-500 my-2')

const Article = ({ title, paragraphs }) => (
  <Container>
    <Title>{title}</Title>
    {paragraphs.map(paragraph => (
      <Paragraph>{paragraph}</Paragraph>
    ))}
  </Container>
)
```

## Conditional styling with props

```jsx
const Input = adorn.input(
  'my-2 p-2 border border-slate-900',
  ({ error }) => error && 'border-red-500',
  ({ focus }) => focus && 'border-blue-900'
)
```

react-adorn takes an unlimited amount of parameters which it will use to decorate the element. Non-string values or functions that resolve to non-string values will not be included in the final classNames string.

To use it:

```jsx
const TextInputWithLabel = ({ label, focus, error }) => (
  <div>
    <Label>{label}</Label>
    <Input type="text" focus={focus} error={error} />
  </div>
)
```

## Use with other components or component libraries

If a component exposes a className prop, you can adorn it:

```jsx
const TextInputWithLabel = ({ className, label, focus, error }) => (
  <div className={className}>
    <Label>{label}</Label>
    <Input type="text" focus={focus} error={error} />
  </div>
)

const InputWithLabelCard = adorn(TextInputWithLabel)`p-5 my-5 border border-slate-900 rounded-md bg-slate-100`
```

also works with conditional styling

```jsx
const InputWithLabelCard = adorn(TextInputWithLabel)(
  'p-5 my-5', // layout
  'border border-slate-900 rounded-md bg-slate-100', // border
  ({ error }) => error && 'border-red-500'
)
```

Your conditional styling props will be available on top of the original components props. All conditional styling props are passed to the adorned component.

## Typescript

This library is written in Typescript and provides full typing for the props used to extend your html elements or components. This means your conditional props will be available for autocomplete.

```tsx
export const InputLabel = adorn.label(
  'block font-normal my-2 hover:cursor-pointer text-neutral-600 w-fit',
  ({ error }: { error?: boolean }) => error && 'text-red-500'
)
```

## Benefits

I like writing code using adorn better than writing the classNames directly on the elements like this:

```jsx
const Article = ({ title, paragraphs }) => (
  <div className="p-5 my-5 border bg-slate-100">
    <h2 className="text-xl text-slate-800 mb-2">{title}</h2>
    {paragraphs.map(paragraph => (
      <p className="text-md text-slate-500 my-2">{paragraph}</p>
    ))}
  </div>
)
```

Because:

- Code is more readable by giving styled elements a name
- Elements have named closing tags, useful for elements with many children
- You can extend your styled elements with props and conditional classNames in a functional manner
- You can group classNames into different parameters so they can still fit within your projects print-limit

## Caveat for conditional styling with some component libraries

Some components libraries provide their own basic html elements extended with some functionality. Like framer motion:

```jsx
import { motion } from 'framer-motion'

const FadeInContainer = ({ children, onClick }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClick}>
    {{ children }}
  </motion.div>
)
```

Often, the extended element (motion.div) takes some props for the extended functionality (here initial and animate props). All other props it receives, it will pass on to the standard html element.

react-adorn works the same way when adorning existing components, all props it receives, it passes on to the adorning component.

When non-string values get passed on html elements like this, React will throw an error:

```jsx
const ErrorDiv = ({ children }) => <div error={true}>{children}</div>
```

When we adorn a component with conditional styling, this might happen. react-adorn will pass the error prop on to the motion.div element, and framer-motion passes all non-framer props on to the basic html element.

```jsx
const StyledFadeInContainer = adorn(FadeInContainer)('m-2 p-2 border rounded-md', ({ error }) => error && 'border-red-600')
```

When we use this and the error-prop value equals false, react will throw an error. To avoid this, we can pass a second argument, which is an array of all prop-names we don't want to pass on to the adorned component. This won't throw the error anymore:

```jsx
const StyledFadeInContainer = adorn(FadeInContainer, ['error'])(
  'm-2 p-2 border rounded-md',
  ({ error }) => error && 'border-red-600'
)
```

This poses no problem when adorning basic html elements, because only valid html props are passed on.

## Inspiration

react-adorn was inspired by and is very similar to [twin.macro](https://github.com/ben-rogerson/twin.macro) but it has no dependency on [emotion](https://emotion.sh/) or any other css-in-js library.
