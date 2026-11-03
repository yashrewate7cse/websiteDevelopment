# Issues and fixes

Note: I could only watch the screen recording of the reel's website. I could not open its code or test it on a phone. So the first list covers what is visible in the video. The second list covers my own first version (v1), which I tested.

## A. Issues visible in the reel's website

| # | Issue | Fix in this version |
|---|-------|---------------------|
| 1 | The visitor waits through an opening animation before the headline shows. | The headline starts rising at 0.15 s. The animation plays around the text, so nobody waits. |
| 2 | Pack names, prices and notes beside the eggs look small and thin. | Bigger, bolder text for prices, pack names and egg notes. |
| 3 | Notes around the eggs (floating callouts) will not fit on a phone. | A clean list under each egg that works at every width. |
| 4 | In the dark "boxed with care" section, brown steps on a brown background are hard to read. | Light text on dark, with the active step in bright yellow. |
| 5 | The "Buy now" buttons give no feedback and there is no cart. | Working cart. An egg flies into the cart icon, the count bounces, and the cart is remembered after refresh. |
| 6 | Footer links and text are tiny. | Larger footer text with hover underlines. |
| 7 | The farm section uses large photos, which are heavy to load. | A light illustration made of code. It loads instantly and has walking hens and moving clouds. |
| 8 | Nothing tells the visitor the animation is interactive. | "Tap an egg" hint. Tapping cracks the egg and a chick hops out. |

## B. Issues in my first version (v1) and how v2 fixes them

| # | Issue in v1 | Fix in v2 |
|---|-------------|-----------|
| 1 | Headline and button stayed hidden for about 4 seconds. | Headline appears at once, the intro is 2.4 s. |
| 2 | On phones the navigation links disappeared with no menu. | Menu button that opens a full-width list. |
| 3 | The cart was lost on refresh. | Cart is saved in the browser (localStorage). |
| 4 | Fonts needed internet, with a plain fallback. | Rounded fallback font stack, and the page still looks fine offline. |
| 5 | The files were spread across folders and long. | Three flat files with numbered sections and comments. |
| 6 | Prices and tour text were buried in the code. | All of them are in one SETTINGS block at the top of script.js. |
| 7 | The hero looked still after the hen stopped. | The hen blinks, flaps and idles. Feathers drift down. A soft sun glow pulses. |
| 8 | Little motion on the cards. | Eggs float, cards lift on hover and shuffle in when you switch Brown/White, items slide in on scroll. |
| 9 | Red label text had weak contrast. | Darker red so white text is easy to read. |
| 10 | The text on the packing sticker overflowed the label. | Wider label and smaller text. |
| 11 | The CTA button overlapped the hen on small phones. | Phone layout adjusted and tested at 390 px and 360 px widths. |
| 12 | Animations could bother some people. | If a device has "reduce motion" on, the finished page shows with no animation. |

## C. Things that are still not done (be honest with yourself)

- Checkout is a demo. To take real orders, add Razorpay or Stripe and a backend.
- Prices, phone number, email and the farm tour text are placeholders.
- I tested in Chrome only. Please also open it in Safari and Firefox before publishing.
- The reel's site was only seen in a recording, so there may be issues in it that are not visible there (speed, phone layout, accessibility).
