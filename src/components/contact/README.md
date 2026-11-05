# How the contact form's spam filter works

My contact form sends email straight from the browser through [EmailJS](https://www.emailjs.com/). That means there's no server of mine to put a spam filter on, so the filter lives in the form itself. It's a **honeypot**: a trap field that people never see, but bots fill in.

## The idea in one paragraph

Simple spam bots don't look at a page the way a person does. They read the form's HTML, find every input, and fill them all in. So I added a fourth field that's hidden from people. A person leaves it empty because they never see it. A bot fills it in because it's in the HTML. When the form is submitted, I check that one field: empty means a person, filled in means a bot.

## How it's built

**1. The hidden field** (`Contact.jsx`). It's a normal text input named `website`, hidden from people in three ways:

| Hidden from | How |
|---|---|
| Eyes | CSS moves it 10,000 px off-screen (`.contact__hp` in `contact.css`) |
| Screen readers | `aria-hidden="true"` on its wrapper |
| Keyboard users | `tabIndex={-1}`, so Tab never lands on it |

It's moved off-screen rather than hidden with `display: none`, because some bots skip fields that are `display: none`.

**2. The check** (`sendEmail` in `Contact.jsx`). When someone clicks Send:
- **The field is empty:** a person, so the message goes to EmailJS as normal.
- **The field is filled in:** a bot. The form shows the usual "Message Sent" dialog and **sends nothing**.

The fake success is on purpose. If the bot got an error, it might retry or try something smarter. Because it thinks it worked, it moves on.

## The trap I had to avoid: browser autofill

The risky part of a honeypot is a *real* visitor's browser filling in the hidden field. If that happens, a recruiter's message gets a success dialog and silently disappears.

- That's why the field is called `website` and not something like `company`. Browsers autofill names, emails, addresses and companies from saved profiles, but not a website field.
- It also has `autoComplete="off"`.
- The visible fields have the opposite: `autoComplete="name"` and `autoComplete="email"`, so a visitor can fill the real form in one click.

I tested it in Chrome: I autofilled the form from the name field and from the email field, then checked the hidden field in DevTools. It was empty both times:
```js
document.querySelector('input[name="website"]').value  // ''
```

## How I know it works

`Contact.test.jsx` checks:
- **Filled honeypot:** the success dialog shows, but EmailJS is never called.
- **Empty honeypot:** EmailJS is called exactly once. This catches the opposite bug, a honeypot that blocks everyone.
- **Hidden properly:** the field has `tabindex="-1"` and `autocomplete="off"`, sits inside an `aria-hidden` wrapper, and screen readers can't find it.
- **Autofill hints:** the name and email fields have their autofill hints.

Run them with `npm test -- --watchAll=false Contact`.

## What it doesn't stop

It only catches *naive* bots. A bot that runs a real browser, or one written for this site specifically, can leave the field empty. For those I rely on:
- EmailJS's own rate limit per IP address;
- my inbox: I'd notice spam quickly and could act on it.

I considered reCAPTCHA (free with EmailJS) and decided against it. An "I'm not a robot" step could put off a recruiter trying to reach me, and on a portfolio site that matters more than some spam. EmailJS's domain allowlist needs a paid plan, so that's off too. The full reasoning is in [`brief.md`](../../../docs/plans/2026-11-05-toolchain-upgrade/brief.md) (option O3).

If spam starts getting through, the next step is reCAPTCHA v2. Deploy the widget first and only then turn it on in the EmailJS dashboard, or every message fails.
