# A product with an owner: questions and assumptions

*Data governance* · *Governance principles*, film 8 · merged; the review-order change in open PR #234 · [pull request](https://github.com/roanboc/learning-data/pull/234)

[Watch it on the site](https://data.learn-all.org/data-governance/a-product-with-an-owner/)

> Copied from the film thread's notes on 10 November 2026. Paths such as `../briefs.md` point to the thread's working folder, not to this repository.

Rodrigo's rule (10 Nov): owners and stewards don't review pull requests. Meaning starts in the glossary, the data team reviews the code, owners are told what a change touches, and only canonical tables get enterprise contracts.

## What changed in the film
- Chapter 5 said "any change to it needs her yes". It now says: "Jun still builds it, Noor designs it, Sam runs it, the data team reviews changes, and she's told what they touch." The next line stays: "She answers for the promise, not the code."
- The change request on the table said "needs: Clara's yes". It now says "review: the data team" and "tell: Clara".
- Pause and think 2: steps "change without asking anyone" became "a change to them touches no other team".

## Assumptions (for Rodrigo's final checklist)
1. Clara still signs the owner's line on the product card. That is her taking on the promise, not approving code. Kept.
2. "It's a draft until its owner says it's ready" is kept: the owner decides the product's status, which is not a code review.
3. The film doesn't say which tables have enterprise contracts. The rule is noted in the script's sources (only canonical tables, after *Governed in dbt*, PR #216). Planning's card keeps "what's in it, column by column".
4. Chapter 6's change request, sent back by the check until it names a product and its owner, is kept: it's an automatic check, not an owner's review.

## Release step for Rodrigo
- New soundtrack indexed as `audio-a-product-with-an-owner-2e7dc6a99ce99958b329`; the MP3 stays tracked in Git. Publish that prerelease, then `media.py verify-remote` and `media.py untrack` when convenient.
