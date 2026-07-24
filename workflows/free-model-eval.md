# Free Model Eval

Find and evaluate free-tier AI models for coding and reasoning.

## Trigger

An event: hearing about a new provider/model that offers a free tier, or running out of credits on the current one.

## Workflow

1. **Discover** — find provider via Reddit, X, HN, friend, or ad
2. **Sign up** — register, check free tier quota (requests/min, total cap, expiration)
3. **Test** — run the same coding/reasoning prompt set (see below)
4. **Grade** — pass/fail on each: did it produce working code? correct logic? hallucinate?
5. **Store** — append to the comparison table in `data/model-comparison.csv`
6. **Keep or drop** — if quality passes and quota lasts >1 session, keep in rotation. Otherwise log the finding and move on.

## Prompts (baseline set)

Run these same prompts against every candidate model:

- **FizzBuzz** in Python — idiomatic one-liner
- **Parse CSV without libraries** — no-pandas constraint
- **Explain this bash one-liner** — describe what `cat logs/*.log | grep ERROR | sort | uniq -c | sort -rn` does
- **Debug this** — given a broken code snippet, spot the bug

## Checkpoints

None. This runs fully autonomous. The table is the output; review it when choosing next model to use.

## Output

Append to `~/SPECTRE/data/model-comparison.csv` with columns:

```
provider,model,tier,quota,coding_pass,coding_total,reasoning_pass,reasoning_total,date_tested,notes
```
