# [WIP]postcss-split-prefers-reduced-motion

split prefers-reduced-motion rules into external file

### input
```css
.animation {
  display: block;
  background-color: #000;
  color: #fff;
  animation: foo 1s linear infinite both;
}

@media (prefers-reduced-motion: reduce) {
  .animation {
    animation: none;
  }
}

@keyframes foo {
   0% {
     transform: translate(0);
   }
   50% {
     transform: translate(0, 1rem);
   }
   100% {
     transform: translate(0);
   }
 }
```

### Output
```css
.animation {
  display: block;
  background-color: #000;
  color: #fff;
  animation: foo 1s linear infinite both;
}

@keyframes foo {
   0% {
     transform: translate(0);
   }
   50% {
     transform: translate(0, 1rem);
   }
   100% {
     transform: translate(0);
   }
 }
```

### Export
```css
.animation {
  animation: none;
}
```

Load file with link element.

```html
<link rel="stylesheet" href="export.css" media="(prefers-reduced-motion: reduce)">
```

## Install

clone this repository

## Usage

```js
module.exports = ctx => ({
  plugins: [
    require('postcss-split-prefers-reduced-motion')({
      value: 'reduce', // reduce|no-preference
      exportTo: 'split.css'
    })
  ]
});

```

## Options

### value
string. see [prefers\-reduced\-motion \- CSS: Cascading Style Sheets \| MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion#Syntax)
