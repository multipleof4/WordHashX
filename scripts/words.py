# Applies the word rules in docs/rules.md to the dump and writes results/words.txt
import gzip, json, re, sys
src = sys.argv[1] if len(sys.argv) > 1 else 'data/kaikki.org-dictionary-English.jsonl.gz'
n, W, D, PL, VB = 0, set(), set(), set(), set()
cats = lambda o: (c if isinstance(c, str) else c.get('name', '') for c in o.get('categories') or [])
for l in gzip.open(src, 'rt', encoding='utf-8'):
    e = json.loads(l)
    n += 1
    w = e.get('word', '')
    W.add(w)
    # Spellings in a demonym category or in Nationalities, for step 8
    if any('demonym' in c.lower() or c == 'Nationalities' for o in [e, *(e.get('senses') or [])] for c in cats(o)): D.add(w.lower())
    # For step 9: spellings that are a verb (VB), and spellings with a "plural of" meaning outside the verb (PL)
    if e.get('pos') == 'verb': VB.add(w.lower())
    elif any('plural' in (s.get('tags') or []) and ('form-of' in s['tags'] or s.get('form_of')) for s in e.get('senses') or []): PL.add(w.lower())
step = lambda r, s: print(f'{len(s):>9,}  {r}')
print(f'{n:>9,}  entries in the dump')
step('1. one per spelling', W)
def group(w):
    if ' ' in w: return 0
    if w[:1] == '-' or w[-1:] == '-': return 1
    if re.search(r'\d', w): return 0
    if not re.search(r'[A-Za-z]', w): return 1
    if re.search(r'[^\x00-\x7f]', w): return 1
    if "'" in w: return 1
    if '-' in w: return 0
    if re.search(r'[^A-Za-z]', w): return 1
    return len(w) == 1
W = {w for w in W if not group(w)}
step('2. drop accents, apostrophes, punctuation, prefixes/suffixes, no Latin letter, single letters', W)
W = {w for w in W if not re.search(r'[^A-Za-z0-9 -]', w)}
step('3. drop any other character than A-Z a-z 0-9 space hyphen', W)
W = {w.lower() for w in W}
step('4. merge case', W)
W = {w for w in W if len(w.split(' ')) <= 3}
step('5. drop more than 3 chunks', W)
W = {w for w in W if not re.search('[ -]', w)}
step('6. drop spaces and hyphens', W)
W = {w for w in W if 2 * len(re.findall(r'\d', w)) <= len(w)}
step('7. drop more than half digits', W)
W -= D
step('8. drop demonyms and nationalities', W)
P = {w for w in W if w[-1] == 's' and w in PL and w in VB}
W = sorted(W - P)
step('9. drop plurals that are also a verb', W)
open('results/words.txt', 'w').write('\n'.join(W) + '\n')
open('results/dropped.txt', 'w').write('\n'.join(sorted(D | P)) + '\n')
