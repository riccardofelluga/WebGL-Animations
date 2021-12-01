#!/usr/bin/env python3

#Give .obj file name as an argument
#Writes the output to a different file named <original obj file>-animated.obj
#The file needs to have the control points defined before using this script

import sys
import random

f = open(sys.argv[1])
ret = 'a v\n'
c = 0
d = {}

for line in f:
    l = line.strip()+'\n'
    if l[0] == 'c':
        c += 1
        ret += l
    elif l[0] == 'f':
        a = l.split(' ')
        for i in range(1,len(a)):
            if not a[i][0] in d:
                d[a[i][0]] = random.randint(1,c)
            if i == len(a) - 1:
                a[i] = a[i][:-1] + '/' + str(d[a[i][0]]) + '\n'
            else:
                a[i] += '/' + str(d[a[i][0]])
        ret += ' '.join(a)
    else:
        ret += l

o = open(sys.argv[1][:-4]+'-animated.obj', 'w')
o.write(ret)
f.close()
o.close()