# /// script
# requires-python = ">=3.10"
# dependencies = ["pyphen==0.17.2"]
# ///
# Splits results/words.txt into syllable pieces by docs/rules.md and writes results/splits.tsv and results/pieces.txt,
# leaving out pieces that are demonyms or nationalities
import collections, itertools, pyphen
P = pyphen.Pyphen(lang='en_US')
W = open('results/words.txt').read().split()
want = lambda w: 1 if len(w) <= 6 else 2 if len(w) <= 10 else 3
def split(w):
    s = P.inserted(w).split('-')
    p = min(want(w), len(s))
    if p == 1: return [w]
    best = None
    for cut in itertools.combinations(range(1, len(s)), p - 1):
        b = (0,) + cut + (len(s),)
        g = [''.join(s[b[i]:b[i + 1]]) for i in range(p)]
        k = (max(map(len, g)) - min(map(len, g)), g)
        if best is None or k < best: best = k
    return best[1]
S = [(w, split(w)) for w in W]
open('results/splits.tsv', 'w').write(''.join(f'{w}\t{" ".join(p)}\n' for w, p in S))
D = set(open('results/dropped.txt').read().splitlines())
A = {x for _, p in S for x in p}
U = sorted(A - D)
open('results/pieces.txt', 'w').write('\n'.join(U) + '\n')
c = collections.Counter(len(p) for _, p in S)
print(f'{len(W):>9,}  words\n' + ''.join(f'{c[k]:>9,}  in {k} piece{"s" * (k > 1)}\n' for k in sorted(c)), end='')
print(f'{sum(len(p) < want(w) for w, p in S):>9,}  fewer pieces than their length asks for')
print(f'{len(A):>9,}  different pieces\n{len(A & D):>9,}  of them demonyms or nationalities, left out\n{len(U):>9,}  pieces\n{len(set(U) & set(W)):>9,}  of them are words\n{len(set(U) - set(W)):>9,}  are not')
