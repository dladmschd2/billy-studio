// Google Drive music controls for desktop and mobile
(() => {
  const KEY='eungchong_studio_v2';
  const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const driveId=u=>String(u||'').match(/\/d\/([\w-]+)/)?.[1]||String(u||'').match(/[?&]id=([\w-]+)/)?.[1]||'';
  const src=u=>{const id=driveId(u);return id?`https://drive.google.com/uc?export=download&id=${id}`:u};
  const style=document.createElement('style');
  style.textContent=`
    #driveMusicBox{display:block!important;margin:12px 0 10px;padding:12px;border:1px solid var(--line);border-radius:14px;background:#fffdf9}
    #driveMusicBox .drive-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}
    @media(max-width:900px){
      #driveMusicBox{display:block!important}
      #driveMusicBox input{font-size:16px!important;min-height:48px}
      #driveMusicBox .drive-actions{display:grid!important;grid-template-columns:1fr 1fr;gap:8px}
      #driveMusicBox .drive-actions .primary{grid-column:1/-1}
      #driveMusicBox .btn{min-height:46px}
    }
  `;
  document.head.appendChild(style);

  function savedUrl(){
    try{
      const d=JSON.parse(sessionStorage.getItem(KEY)||'null');
      const title=document.querySelector('.ep-title')?.value;
      if(!d||!title)return '';
      for(const t of d.topics||[])for(const s of t.scenarios||[])for(const e of s.episodes||[])if(e.title===title)return e.musicDriveUrl||'';
    }catch(_){}
    return '';
  }

  function mount(){
    const player=document.getElementById('episodeAudio');
    const musicCard=[...document.querySelectorAll('.card')].find(c=>c.querySelector('h3')?.textContent.trim()==='이 편의 음악');
    if(!player||!musicCard)return;

    let box=document.getElementById('driveMusicBox');
    if(!box){
      const saved=savedUrl();
      box=document.createElement('div');
      box.id='driveMusicBox';
      box.innerHTML=`<label class="field"><span>Google Drive 음악 링크</span><input id="musicDriveUrl" inputmode="url" autocapitalize="none" autocomplete="off" value="${esc(saved)}" placeholder="Google Drive 음악 링크 붙여넣기"></label><div class="drive-actions"><button type="button" class="btn primary" id="driveApply">Drive 음악 연결</button><button type="button" class="btn" id="driveOpen" ${saved?'':'hidden'}>Drive에서 열기</button><button type="button" class="btn" id="driveClear" ${saved?'':'hidden'}>링크 지우기</button></div>`;
      const status=document.getElementById('musicStatus');
      if(status)status.insertAdjacentElement('afterend',box);else musicCard.prepend(box);
    }

    const input=box.querySelector('#musicDriveUrl');
    const apply=box.querySelector('#driveApply');
    const open=box.querySelector('#driveOpen');
    const clear=box.querySelector('#driveClear');
    if(!input||!apply||!open||!clear)return;

    const saved=savedUrl();
    if(saved&&!input.value)input.value=saved;
    open.hidden=clear.hidden=!input.value.trim();

    const play=u=>{
      if(!u)return;
      player.src=src(u);player.load();
      const st=document.getElementById('musicStatus');
      if(st)st.innerHTML='<strong>♪ Google Drive 음악</strong><br>이 에피소드에 연결된 Drive 음악입니다.';
    };

    apply.onclick=()=>{
      const u=input.value.trim();
      if(!u)return alert('Google Drive 음악 링크를 입력해주세요.');
      window.updateEp?.('musicDriveUrl',u);
      open.hidden=clear.hidden=false;
      play(u);
    };
    open.onclick=()=>{const u=input.value.trim();if(u)window.open(u,'_blank','noopener')};
    clear.onclick=()=>{
      input.value='';
      window.updateEp?.('musicDriveUrl','');
      open.hidden=clear.hidden=true;
      player.removeAttribute('src');
      player.load();
    };
  }

  const observer=new MutationObserver(()=>requestAnimationFrame(mount));
  observer.observe(document.body,{childList:true,subtree:true});
  setInterval(mount,700);
  window.addEventListener('load',mount);
  document.addEventListener('DOMContentLoaded',mount);
})();
