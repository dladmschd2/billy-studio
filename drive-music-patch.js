// Google Drive music UI patch
(() => {
  const KEY='eungchong_studio_v2';
  const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const driveId=u=>String(u||'').match(/\/d\/([\w-]+)/)?.[1]||String(u||'').match(/[?&]id=([\w-]+)/)?.[1]||'';
  const src=u=>{const id=driveId(u);return id?`https://drive.google.com/uc?export=download&id=${id}`:u};
  function savedUrl(){
    try{
      const d=JSON.parse(sessionStorage.getItem(KEY)||'null');
      const title=document.querySelector('.ep-title')?.value;
      if(!d||!title)return '';
      for(const t of d.topics||[])for(const s of t.scenarios||[])for(const e of s.episodes||[])if(e.title===title)return e.musicDriveUrl||'';
    }catch(_){}
    return '';
  }
  function inject(){
    const player=document.getElementById('episodeAudio');
    const select=document.getElementById('musicSelect');
    if(!player||!select||document.getElementById('driveMusicBox'))return;
    const anchor=select.closest('label.field');
    if(!anchor||!anchor.parentNode)return;
    const saved=savedUrl();
    const box=document.createElement('div');
    box.id='driveMusicBox';
    box.style.marginBottom='10px';
    box.innerHTML=`<label class="field"><span>Google Drive 음악 링크</span><input id="musicDriveUrl" value="${esc(saved)}" placeholder="https://drive.google.com/file/d/.../view"></label><div style="display:flex;gap:6px;flex-wrap:wrap"><button type="button" class="btn primary" id="driveApply">Drive 음악 연결</button><button type="button" class="btn" id="driveOpen" ${saved?'':'hidden'}>Drive에서 열기</button><button type="button" class="btn" id="driveClear" ${saved?'':'hidden'}>링크 지우기</button></div><p style="font-size:9px;line-height:1.55;color:var(--muted);margin:7px 0 0">Google Drive 파일 공유 권한은 ‘링크가 있는 사용자 · 뷰어’로 설정해주세요.</p>`;
    anchor.parentNode.insertBefore(box,anchor);
    const input=box.querySelector('#musicDriveUrl');
    const open=box.querySelector('#driveOpen');
    const clear=box.querySelector('#driveClear');
    const play=u=>{if(!u)return;player.src=src(u);player.load();const st=document.getElementById('musicStatus');if(st)st.innerHTML='<strong>♪ Google Drive 음악</strong><br>이 에피소드에 연결된 Drive 음악입니다.';};
    if(saved)play(saved);
    box.querySelector('#driveApply').onclick=()=>{
      const u=input.value.trim();
      if(!u)return alert('Google Drive 음악 링크를 입력해주세요.');
      if(typeof window.updateEp==='function')window.updateEp('musicDriveUrl',u);
      open.hidden=false;clear.hidden=false;play(u);
    };
    open.onclick=()=>{const u=input.value.trim();if(u)window.open(u,'_blank','noopener')};
    clear.onclick=()=>{input.value='';if(typeof window.updateEp==='function')window.updateEp('musicDriveUrl','');open.hidden=true;clear.hidden=true;player.removeAttribute('src');player.load();};
  }
  setInterval(inject,300);
  window.addEventListener('load',inject);
})();
