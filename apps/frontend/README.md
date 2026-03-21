# Animation

> **Pseudo Win95 Solitaire animation** - you wanted animations? Codex has some in it's silicon sleeves.

I went out of the rails just because that card thing was quite a fun for me, but I must admit all the animations are done by Codex while
I was pushing it to the goal I had in my head.

I've some knowledge about react motion, but the math and the complexity behind it here is far in my past when I was writing 3D engine using
C and SDL (OpenGL).

# Credits

> If this file is not here, I would just lie straight to your face - frontend is done highly with me + Codex coop.

- custom openapi spec found on internet and optimized with Codex and real results from the API itself (my + Codex coop)
- @use-pico lib, it's style system - me
- architecture setup (e.g. useSnapGame control hook, ...) - me
- SDK setup to conform API and have single-source-of-truth - me
- _hard lifting_ - Codex (card ratio, game workflow, probability)
- service + data flow - me -> Codex
- little optimizations (e.g. one-shot functions removed) - me -> Codex

> I just want be honest - I've used Codex quite a bit here while I was reviving what it's been doing,
> but built on block which I've built by hand (e.g. style system, @use-pico lib, ...), ImageHero for handling
> nice image loading, ...
>
> It's not blind "vibe code" stuff, but the manual labor has been done by Codex.