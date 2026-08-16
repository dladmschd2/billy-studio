window.__BILLY_CHUNKS=window.__BILLY_CHUNKS||[];window.__BILLY_CHUNKS.push(`
// Google Drive music-link support
for(const t of data.topics||[])for(const s of t.scenarios||[])for(const ep of s.episodes||[]){if(typeof ep.musicDriveUrl!=='string')ep.musicDriveUrl='';}
const __editorOriginal=editor;
editor=function(e){
  let html=__editorOriginal(e);
  const marker='<label class="field"><span>연결된 폴더에서 음악 고르기</span>';
  const driveBlock=`<label class="field"><span>Google Drive 음악 링크</span><input id="musicDriveUrl" value="${esc(e.musicDriveUrl||'')}" placeholder="https://drive.google.com/file/d/.../view" oninput="updateDriveMusicUrl(this.value)"></label><div style="display:flex;gap:6px;flex-wrap:wrap"><button type="button" class="btn primary" onclick="applyDriveMusic()">Drive 음악 연결</button>${e.musicDriveUrl?`<button type="button" class="btn" onclick="openDriveMusic()">Drive에서 열기</button><button type="button" class="btn" onclick="clearDriveMusic()">링크 지우기</button>`:''}</div><p style="font-size:9px;line-height:1.55;color:var(--muted);margin:7px 0 10px">Drive 파일 공유 권한을 ‘링크가 있는 사용자 · 뷰어’로 설정해주세요. Drive 링크가 있으면 로컬 폴더 음악보다 우선 재생합니다.</p>`;
  if(html.includes(marker)) html=html.replace(marker,driveBlock+marker);
  return html;
};
function driveAudioSrc(url){const id=driveId(url||'');return id?`https://drive.google.com/uc?export=download&id=${id}`:(url||'');}
window.updateDriveMusicUrl=v=>{current().e.musicDriveUrl=v.trim();schedule();};
window.applyDriveMusic=()=>{const input=document.getElementById('musicDriveUrl');if(input)current().e.musicDriveUrl=input.value.trim();if(!current().e.musicDriveUrl)return toast('Google Drive 음악 링크를 입력해주세요.');schedule();prepareEpisodeMusic(false);renderWork();toast('Drive 음악을 연결했어요.');};
window.clearDriveMusic=()=>{current().e.musicDriveUrl='';schedule();renderWork();setTimeout(()=>prepareEpisodeMusic(false),0);toast('Drive 음악 링크를 지웠어요.');};
window.openDriveMusic=()=>{const u=current().e.musicDriveUrl;if(u)window.open(u,'_blank','noopener');};
const __prepareEpisodeMusicOriginal=prepareEpisodeMusic;
prepareEpisodeMusic=async function(tryPlay){
  const el=document.getElementById('episodeAudio'),st=document.getElementById('musicStatus');if(!el)return;
  const {e}=current();
  if(e?.musicDriveUrl){
    if(activeAudioUrl){URL.revokeObjectURL(activeAudioUrl);activeAudioUrl=null;}
    const src=driveAudioSrc(e.musicDriveUrl);el.src=src;el.load();
    if(st)st.innerHTML='<strong>♪ Google Drive 음악</strong><br>이 에피소드에 저장된 Drive 링크를 재생합니다.';
    el.onerror=()=>{if(st)st.innerHTML='<strong>Drive에서 바로 재생하지 못했어요.</strong><br>공유 권한을 확인하거나 아래 ‘Drive에서 열기’를 이용해주세요.';};
    if(tryPlay){try{await el.play()}catch(_){}}
    return;
  }
  return __prepareEpisodeMusicOriginal(tryPlay);
};
`);
