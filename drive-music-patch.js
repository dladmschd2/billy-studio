// Google Drive music + editor layout polish
(() => {
  const KEY='eungchong_studio_v2';
  const esc=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const driveId=u=>String(u||'').match(/\/d\/([\w-]+)/)?.[1]||String(u||'').match(/[?&]id=([\w-]+)/)?.[1]||'';
  const src=u=>{const id=driveId(u);return id?`https://drive.google.com/uc?export=download&id=${id}`:u};
  const style=document.createElement('style');
  style.textContent=`
    .layout{max-width:1360px!important;grid-template-columns:minmax(0,1fr) 250px!important;gap:16px!important}
    .scenario-head,.tabs{max-width:1360px!important}
    .manuscript{min-height:68vh!important}
    .editor-tools{grid-column:1/-1;display:grid;grid-template-columns:minmax(0,1.8fr) minmax(220px,.7fr);gap:14px;margin-top:2px;margin-bottom:48px}
    .editor-tools>.card{margin:0;box-shadow:var(--shadow)}
    .editor-tools .lyrics-box{margin:0;border:0;background:transparent}
    .editor-tools .lyrics-box summary{font:700 15px "Gowun Batang";cursor:pointer;margin-bottom:10px}
    .panel .card{box-shadow:0 10px 28px #3c30250d}
    #driveMusicBox{margin-top:10px}
    @media(max-width:1050px){.layout{grid-template-columns:minmax(0,1fr) 230px!important}.editor-tools{grid-template-columns:1fr}.editor-tools>.lyrics-tool{grid-column:auto}}
    @media(max-width:820px){.layout{grid-template-columns:1fr!important}.panel{grid-column:1}.editor-tools{grid-template-columns:1fr}}
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
  function ensureDriveBox(){
    const player=document.getElementById('episodeAudio');
    if(!player||document.getElementById('driveMusicBox'))return;
    const musicCard=[...document.querySelectorAll('.panel .card')].find(c=>c.querySelector('h3')?.textContent.trim()==='이 편의 음악');
    if(!musicCard)return;
    const details=musicCard.querySelector('.lyrics-box');
    const saved=savedUrl();
    const box=document.createElement('div');box.id='driveMusicBox';
    box.innerHTML=`<label class="field"><span>Google Drive 음악 링크</span><input id="musicDriveUrl" value="${esc(saved)}" placeholder="https://drive.google.com/file/d/.../view"></label><div style="display:flex;gap:6px;flex-wrap:wrap"><button type="button" class="btn primary" id="driveApply">Drive 음악 연결</button><button type="button" class="btn" id="driveOpen" ${saved?'':'hidden'}>Drive에서 열기</button><button type="button" class="btn" id="driveClear" ${saved?'':'hidden'}>링크 지우기</button></div><p style="font-size:9px;line-height:1.55;color:var(--muted);margin:7px 0 0">Google Drive 파일 공유 권한은 ‘링크가 있는 사용자 · 뷰어’로 설정해주세요.</p>`;
    if(details)musicCard.insertBefore(box,details);else musicCard.appendChild(box);
    const input=box.querySelector('#musicDriveUrl'),open=box.querySelector('#driveOpen'),clear=box.querySelector('#driveClear');
    const play=u=>{if(!u)return;player.src=src(u);player.load();const st=document.getElementById('musicStatus');if(st)st.innerHTML='<strong>♪ Google Drive 음악</strong><br>이 에피소드에 연결된 Drive 음악입니다.';};
    if(saved)play(saved);
    box.querySelector('#driveApply').onclick=()=>{const u=input.value.trim();if(!u)return alert('Google Drive 음악 링크를 입력해주세요.');window.updateEp?.('musicDriveUrl',u);open.hidden=clear.hidden=false;play(u)};
    open.onclick=()=>{const u=input.value.trim();if(u)window.open(u,'_blank','noopener')};
    clear.onclick=()=>{input.value='';window.updateEp?.('musicDriveUrl','');open.hidden=clear.hidden=true;player.removeAttribute('src');player.load()};
  }
  function simplifyAndMove(){
    const layout=document.querySelector('.layout'),panel=layout?.querySelector('.panel');
    if(!layout||!panel)return;
    const musicSelect=document.getElementById('musicSelect');
    musicSelect?.closest('label.field')?.remove();
    [...panel.querySelectorAll('button')].forEach(b=>{if(b.textContent.includes('컴퓨터에서 음악 폴더 연결'))b.remove()});

    let tools=layout.querySelector('.editor-tools');
    if(!tools){tools=document.createElement('section');tools.className='editor-tools';layout.appendChild(tools)}

    const musicCard=[...panel.querySelectorAll('.card')].find(c=>c.querySelector('h3')?.textContent.trim()==='이 편의 음악');
    const lyrics=musicCard?.querySelector('.lyrics-box');
    if(lyrics&&!tools.querySelector('.lyrics-tool')){
      const wrap=document.createElement('section');wrap.className='card lyrics-tool';
      const h=document.createElement('h3');h.textContent='가사 작업';wrap.appendChild(h);wrap.appendChild(lyrics);tools.prepend(wrap);
    }
    const ccm=[...panel.querySelectorAll('.card')].find(c=>c.querySelector('h3')?.textContent.trim()==='이 글로 CCM 만들기');
    if(ccm&&!tools.contains(ccm))tools.appendChild(ccm);
    const manage=[...panel.querySelectorAll('.card')].find(c=>c.querySelector('h3')?.textContent.trim()==='편 관리');
    if(manage)manage.remove();
  }
  function enhance(){ensureDriveBox();simplifyAndMove()}
  setInterval(enhance,300);
  window.addEventListener('load',enhance);
})();
