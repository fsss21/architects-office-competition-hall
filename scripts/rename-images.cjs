const fs = require('fs')
const path = require('path')

const imgDir = path.join(__dirname, '..', 'public', 'data', 'images')

// Map: leading number in original filename -> new filename (by catalog id / extra)
// 3=Габе, 8=Стамов, 9=Рыбалко фигура, 10=Рыбалко бюст, 11=Аникушин, 5=Симун, 12=Свешников
const renames = {
  '3': '1_gabe_dinamichnyi.jpg',
  '8': '2_stamov_klassika.jpg',
  '9': '3_rybalko_akadem.jpg',
  '10': '4_rybalko_byust.jpg',
  '11': '5_anikushin_lakonich.jpg',
  '5': '6_simun_sovr_mat.jpg',
  '12': '7_sveshnikov_petrov.jpg',
  '1': '8_yastreb_tatarovich.jpg',
  '2': '9_degtyarev_speranskiy_1tur.jpg',
  '4': '10_malushina_furtsev.jpg',
  '6': '11_kochukov_gepner.jpg',
  '7': '12_degtyarev_model.jpg'
}

const files = fs.readdirSync(imgDir)
for (const name of files) {
  const m = name.match(/^(\d+)\./)
  if (!m) continue
  const num = m[1]
  const newName = renames[num]
  if (!newName) continue
  const ext = path.extname(name)
  const base = newName.replace(/\.[a-z]+$/i, '')
  const targetName = base + ext
  const oldPath = path.join(imgDir, name)
  const newPath = path.join(imgDir, targetName)
  if (oldPath === newPath) continue
  if (fs.existsSync(newPath)) {
    console.warn('Skip (exists):', name, '->', targetName)
    continue
  }
  fs.renameSync(oldPath, newPath)
  console.log(name, '->', targetName)
}
