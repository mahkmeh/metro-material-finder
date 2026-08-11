export default async function middleware(request) {
  const response = await fetch(request);
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  const html = await response.text();
  const injection = `<script>
(function(){
  if (window.__metroFeedbackPatched) return;
  window.__metroFeedbackPatched = true;
  const originalSave = window.save;
  if (typeof originalSave !== 'function') return;
  window.save = async function(payload){
    try {
      const r = await fetch('/api/feedback', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({...payload, clientAt:new Date().toISOString()}),
        keepalive:true
      });
      if (!r.ok) throw new Error('Feedback API '+r.status);
      window.__metroFeedbackLastSync = 'ok';
      return true;
    } catch (e) {
      try {
        const a = JSON.parse(localStorage.getItem('metro_material_feedback') || '[]');
        a.push({...payload, clientAt:new Date().toISOString(), syncError:String(e)});
        localStorage.setItem('metro_material_feedback', JSON.stringify(a));
      } catch (_) {}
      return false;
    }
  };
})();
</script>`;
  return new Response(html.replace('</body>', injection + '</body>'), {
    status: response.status,
    headers: response.headers
  });
}
