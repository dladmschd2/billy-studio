// Google Drive music + editor/mobile/login polish
(() => {
  const KEY='eungchong_studio_v2';
  const EMAIL_KEY='billy_saved_email';
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
    #mobileDriveCard{display:none}
    .remember-login{display:flex;align-items:center;gap:7px;margin:8px 0 3px;font-size:10px;color:var(--muted)}
    .remember-login input{width:16px;height:16px}
    @media(max-width:1050px){.layout{grid-template-columns:minmax(0,1fr) 230px!important}.editor-tools{grid-template-columns:1fr}.editor-tools>.lyrics-tool{grid-column:auto}}
    @media(max-width:900px){
      .layout{grid-template-columns:1fr!important}.panel{grid-column:1}.editor-tools{grid-template-columns:1fr}
      #driveMusicBox{display:none!important}
      #mobileDriveCard{display:block!important;grid-column:1/-1;margin-top:12px}
      #mobileDriveCard .field input{font-size:16px!important;min-height:48px}
      #mobileDriveCard .btn{min-height:46px;padding:11px 14px;font-size:12px}
      #mobileDriveCard .mobile-drive-actions{display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px}
      #mobileDriveCard .mobile-drive-actions .primary{grid-column:1/-1}
      .auth-card input{font-size:16px!important;min-height:46px}
      .auth-card .auth-main{min-height:46px}
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
  function bindDriveUI(root,inputId,applyId,openId,clearId){
    const player=document.getElementById('episodeAudio');if(!player)return;
    const input=root.querySelector('#'+inputId),open=root.querySelector('#'+openId),clear=root.querySelector('#'+clearId),apply=root.querySelector('#'+applyId);
    if(!input||!open||!clear||!apply)return;
    const play=u=>{if(!u)return;player.src=src(u);player.load();const st=document.getElementById('musicStatus');if(st)st.innerHTML='<strong>♪ Google Drive 음악</strong><br>이 에피소드에 연결된 Drive 음악입니다.';};
    const saved=savedUrl();if(saved)play(saved);
    apply.onclick=()=>{const u=input.value.trim();if(!u)return alert('Google Drive 음악 링크를 입력해주세요.');window.updateEp?.('musicDriveUrl',u);open.hidden=clear.hidden=false;play(u)};
    open.onclick=()=>{const u=input.value.trim();if(u)window.open(u,'_blank','noopener')};
    clear.onclick=()=>{input.value='';window.updateEp?.('musicDriveUrl','');open.hidden=clear.hidden=true;player.removeAttribute('src');player.load()};
  }
  function ensureDriveBox(){
    const player=document.getElementById('episodeAudio');
    if(!player||document.getElementById('driveMusicBox'))return;
    const musicCard=[...document.querySelectorAll('.card')].find(c=>c.querySelector('h3')?.textContent.trim()==='이 편의 음악');
    if(!musicCard)return;
    const details=musicCard.querySelector('.lyrics-box');
    const saved=savedUrl();
    const box=document.createElement('div');box.id='driveMusicBox';
    box.innerHTML=`<label class="field"><span>Google Drive 음악 링크</span><input id="musicDriveUrl" inputmode="url" autocapitalize="none" autocomplete="off" value="${esc(saved)}" placeholder="Google Drive 음악 링크 붙여넣기"></label><div style="display:flex;gap:6px;flex-wrap:wrap"><button type="button" class="btn primary" id="driveApply">Drive 음악 연결</button><button type="button" class="btn" id="driveOpen" ${saved?'':'hidden'}>Drive에서 열기</button><button type="button" class="btn" id="driveClear" ${saved?'':'hidden'}>링크 지우기</button></div>`;
    if(details)musicCard.insertBefore(box,details);else musicCard.appendChild(box);
    bindDriveUI(box,'musicDriveUrl','driveApply','driveOpen','driveClear');
  }
  function ensureMobileDriveCard(){
    const player=document.getElementById('episodeAudio');
    const layout=document.querySelector('.layout'),paper=layout?.querySelector('.paper');
    if(!player||!layout||!paper||document.getElementById('mobileDriveCard'))return;
    const saved=savedUrl();
    const card=document.createElement('section');card.id='mobileDriveCard';card.className='card';
    card.innerHTML=`<h3>이 편의 음악 연결</h3><p style="font-size:10px;line-height:1.6;color:var(--muted);margin:-3px 0 12px">Google Drive 앱에서 음악 파일의 공유 링크를 복사해 아래에 붙여넣으세요.</p><label class="field"><span>Google Drive 음악 링크</span><input id="mobileMusicDriveUrl" inputmode="url" autocapitalize="none" autocomplete="off" value="${esc(saved)}" placeholder="Drive 링크 붙여넣기"></label><div class="mobile-drive-actions"><button type="button" class="btn primary" id="mobileDriveApply">음악 연결</button><button type="button" class="btn" id="mobileDriveOpen" ${saved?'':'hidden'}>Drive에서 열기</button><button type="button" class="btn" id="mobileDriveClear" ${saved?'':'hidden'}>링크 지우기</button></div>`;
    paper.insertAdjacentElement('afterend',card);
    bindDriveUI(card,'mobileMusicDriveUrl','mobileDriveApply','mobileDriveOpen','mobileDriveClear');
  }
  function simplifyAndMove(){
    const layout=document.querySelector('.layout'),panel=layout?.querySelector('.panel');
    if(!layout||!panel)return;
    const musicSelect=document.getElementById('musicSelect');musicSelect?.closest('label.field')?.remove();
    [...document.querySelectorAll('button')].forEach(b=>{if(b.textContent.includes('컴퓨터에서 음악 폴더 연결'))b.remove()});
    let tools=layout.querySelector('.editor-tools');if(!tools){tools=document.createElement('section');tools.className='editor-tools';layout.appendChild(tools)}
    const musicCard=[...panel.querySelectorAll('.card')].find(c=>c.querySelector('h3')?.textContent.trim()==='이 편의 음악');
    const lyrics=musicCard?.querySelector('.lyrics-box');
    if(lyrics&&!tools.querySelector('.lyrics-tool')){const wrap=document.createElement('section');wrap.className='card lyrics-tool';const h=document.createElement('h3');h.textContent='가사 작업';wrap.appendChild(h);wrap.appendChild(lyrics);tools.prepend(wrap)}
    const ccm=[...panel.querySelectorAll('.card')].find(c=>c.querySelector('h3')?.textContent.trim()==='이 글로 CCM 만들기');if(ccm&&!tools.contains(ccm))tools.appendChild(ccm);
    const manage=[...panel.querySelectorAll('.card')].find(c=>c.querySelector('h3')?.textContent.trim()==='편 관리');if(manage)manage.remove();
  }
  function improveLogin(){
    const email=document.getElementById('authEmail'),pw=document.getElementById('authPassword');if(!email||!pw)return;
    email.setAttribute('autocomplete','username');email.setAttribute('autocapitalize','none');email.setAttribute('inputmode','email');pw.setAttribute('autocomplete','current-password');
    const card=email.closest('.auth-card');if(!card||card.querySelector('.remember-login'))return;
    const saved=localStorage.getItem(EMAIL_KEY)||'';if(saved&&!email.value)email.value=saved;
    const row=document.createElement('label');row.className='remember-login';row.innerHTML=`<input type="checkbox" id="rememberEmail" ${saved?'checked':''}><span>이 기기에서 이메일 기억</span>`;
    const loginBtn=card.querySelector('button[onclick="loginCloud()"]');card.insertBefore(row,loginBtn);
    const original=window.loginCloud;window.loginCloud=async()=>{if(document.getElementById('rememberEmail')?.checked)localStorage.setItem(EMAIL_KEY,email.value.trim());else localStorage.removeItem(EMAIL_KEY);return original?.()};
    pw.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();window.loginCloud?.()}});
  }
  function enhance(){ensureDriveBox();ensureMobileDriveCard();simplifyAndMove();improveLogin()}
  const observer=new MutationObserver(enhance);
  observer.observe(document.documentElement,{childList:true,subtree:true});
  setInterval(enhance,500);
  window.addEventListener('load',enhance);
  document.addEventListener('DOMContentLoaded',enhance);
})();
