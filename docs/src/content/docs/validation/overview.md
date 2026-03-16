---
title: Validation Overview
description: How to use the validate prop and all supported formats.
---

The `validate` prop on [`<Field>`](/components/field/), [`<Input>`](/components/input/), [`<Textarea>`](/components/textarea/), and [`<Select>`](/components/select/) accepts validation rules in four formats.

## Formats

### Single Rule (string)

Pass a rule name as a string. The error message is auto-generated.

```astro
<Input name="name" validate="required" />
```

### Multiple Rules (array)

Pass an array of rule names. Rules are evaluated in order — the first failure is shown.

```astro
<Input name="age" validate={['required', 'integer']} />
```

### Object Map (custom messages)

Pass an object mapping rule names to custom error messages. Any rule without a message uses the auto-generated one.

```astro
<Input
  name="email"
  validate={{ required: 'Email is required', email: 'Invalid email format' }}
/>
```

Parameterized rules work as object keys too:

```astro
<Input
  name="age"
  validate={{ required: 'Required', 'between[18,99]': 'Must be between 18 and 99' }}
/>
```

### Explicit Entry Array (legacy)

Pass an array of `{ rule, message }` objects:

```astro
<Input
  name="email"
  validate={[
    { rule: 'required', message: 'Email is required' },
    { rule: 'email', message: 'Invalid email format' },
  ]}
/>
```

## Rule References

- [Simple Rules](/validation/simple-rules/) — rules with no parameters (`required`, `email`, `uuid`, etc.)
- [Parameterized Rules](/validation/parameterized-rules/) — rules that take arguments (`between[n,m]`, `in[a,b,c]`, etc.)
