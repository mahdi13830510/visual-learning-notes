# Contributing to Visual Learning Notes

The skill improves most from one thing: **notes that fell short.**

## Report weak notes

Open an issue with the *Notes fell short* template and include:
- the exact prompt, and the material you gave it (or a description of it);
- what failed: a page that reads like a textbook, a diagram that says nothing, a wrong equation or number, a missing assumption, something you couldn't draw by hand, a rendering bug;
- what good notes would have done instead, if you know.

## Change the skill

1. Edit `SKILL.md` or a file in `references/`. Keep SKILL.md short and put detail in the references.
2. Test with a fresh Claude session (or a subagent) that has only the skill, on a topic **not** mentioned in the skill files, so you measure generalisation rather than copying.
3. Render the result with `scripts/render_notes.py`, look at every page, and score it with [`tests/rubric.md`](tests/rubric.md).
4. Use short conventional commit messages (`feat:`, `fix:`, `docs:`, `test:`).

## Add a showcase

Excellent notes are welcome in `showcase/<topic>/`: include `index.html`, `notes.pdf`, `blueprint.md`, and the prompt you used.
