import json, os, sys
import os as _os
ROOT=_os.path.join(_os.path.dirname(_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))), 'dioramareels', 'reels')
V={'narr':'a33f7a4c-100f-41cf-a1fd-5822e8fc253f','girl':'8d8ce8c9-44a4-46c4-b10f-9a927b99a853','woman':'d79d2b77-9192-4e10-9407-5d43ca034803','guy':'9fa83ce3-c3a8-4523-accc-173904582ced',
   'dad':'0ad65e7f-006c-47cf-bd31-52279d487913','ghost':'c99d36f3-5ffd-4253-803a-535c1bc9c306','waiter':'49743b08-0f5d-4741-839c-b12933853780','uncle':'db69127a-dbaf-4fa9-b425-2fe67680c348',
   'grandma':'26403c37-80c1-4a1a-8692-540551ca2ae5','grandpa':'a892d232-f705-40d7-bc8d-e368b295ec2a','bride':'57dcab65-68ac-45a6-8480-6c4c52ec1cd1'}
V.update({'alien':'bfd3644b-d561-4b1c-a01f-d9af98cb67c0','old':'87748186-23bb-4158-a1eb-332911b0b708','trav':'3d5ce2fb-e56c-42f0-9ed9-4662484063b4','vil':'9fb269e7-70fe-4cbe-aa3f-28bdb67e3e84','hero':'710feaa3-b550-42f3-b3eb-6f37f2a7cc0a',
 'robot':'3c0f09d6-e0d7-499c-a594-70c5b7b93048','death':'6a176356-ada1-4b48-b2ae-3a3fdd485680','genie':'afb19d1b-4044-4f34-a962-f4aef640a002','vamp':'5568a7df-e5ab-4442-9fae-2e9ba1b15ad8','mermaid':'e4d5f4c4-6601-4779-bee1-b3c14d629dc6','cupid':'e98bd614-9b9d-4031-b930-ed72482af858'})
def build(r):
    d=os.path.join(ROOT,r['id']); os.makedirs(d,exist_ok=True)
    lines=[]
    for ln in r['lines']:
        shot,who,text=ln[0],ln[1],ln[2]; o={'shot':shot,'cap':text,'say':text}
        if who: o['who']=who
        if len(ln)>3 and ln[3]: o['bubble']=ln[3]
        if len(ln)>4 and ln[4]: o['think']=True
        if len(ln)>5 and ln[5]: o['emotion']=ln[5]
        if len(ln)>6 and ln[6]: o['say']=ln[6]
        lines.append(o)
    json.dump({'lines':lines},open(f'{d}/script.json','w'),indent=1,ensure_ascii=False)
    json.dump({'title':r['title'],'caption':r['caption'],'hashtags':r['tags'],'first_comment':r['comment'],'format':'tb3d','kind':r.get('kind','story'),'sources':['Original story (Thought Bubble series).']},open(f'{d}/meta.json','w'),indent=1,ensure_ascii=False)
    json.dump({'provider':'cartesia','one_take':False,'model_id':'sonic-3.6-2026-08-27','voice_id':V['narr'],'line_gap':0.14,'shot_gap':0.25,'cast':{w:V[v] for w,v in r['voices'].items()}, **({'fx':r['fx']} if r.get('fx') else {})},open(f'{d}/voice.json','w'),indent=1)
    js='// '+r['id']+' Thought Bubble 3D (k.tb template): '+r['title']+'\nSTORY((k) => k.tb('+r['spec']+'), { assets: [...(window.TB_ASSETS || []), \'mini/male-a\', \'mini/male-b\', \'mini/male-c\', \'mini/male-d\', \'mini/male-e\', \'mini/male-f\', \'mini/female-a\', \'mini/female-b\', \'mini/female-c\', \'mini/female-d\', \'mini/female-e\', \'mini/female-f\', \'humans/ual1\'' + ''.join(', \'' + a + '\'' for a in r.get('assets', [])) + '] });\n'
    open(f'{d}/reel.js','w').write(js)
    print(r['id'], sum(len(l[2].split()) for l in r['lines']),'words')
for f in sys.argv[1:]:
    exec(open(f).read())
    for r in REELS: build(r)
