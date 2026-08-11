from pathlib import Path

path = Path('index.html')
s = path.read_text(encoding='utf-8')

old = '''function save(x){const a=JSON.parse(localStorage.getItem("metro_material_feedback")||"[]");a.push(x);localStorage.setItem("metro_material_feedback",JSON.stringify(a))}'''
new = '''function save(x){
  fetch('/api/feedback',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(x),
    keepalive:true
  }).then(r=>{if(!r.ok)throw new Error('Feedback API returned '+r.status)})
    .catch(()=>{
      const a=JSON.parse(localStorage.getItem("metro_material_feedback")||"[]");
      a.push(x);
      localStorage.setItem("metro_material_feedback",JSON.stringify(a));
    });
}'''

if s.count(old) != 1:
    raise SystemExit(f'Expected exactly one feedback save function, found {s.count(old)}')
s = s.replace(old, new)

old_note = 'Feedback is stored locally until the central feedback service is connected.'
new_note = 'Feedback is stored centrally for continuous improvement; browser storage is used only if the service is temporarily unavailable.'
if s.count(old_note) != 1:
    raise SystemExit(f'Expected exactly one feedback note, found {s.count(old_note)}')
s = s.replace(old_note, new_note)

path.write_text(s, encoding='utf-8')
print('Central feedback integration enabled.')
