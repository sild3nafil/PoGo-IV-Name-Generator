# Pokémon GO IV 名稱產生器

## 功能

- 選擇攻擊、防禦、HP，範圍均為 0～15
- 自動計算 IV：`Math.round(((attack + defense + hp) / 45) * 100)`
- 將 IV 百分比轉成 Unicode 上標小字
- 將三項個體值轉成實心圈或空心圈數字
- 一鍵複製完整名稱
- Pokémon GO 靈感介面
- 淺色／深色模式切換
- 自動記住上次選擇的主題
- 手機版響應式介面

## GitHub Pages 部署

1. 將 ZIP 解壓縮。
2. 把 `index.html`、`style.css`、`script.js`、`README.md` 上傳到 GitHub repository 根目錄。
3. 到 Repository 的 `Settings` → `Pages`。
4. Source 選擇 `Deploy from a branch`。
5. Branch 選擇 `main`，資料夾選 `/root`。
6. 儲存後等待 GitHub Pages 建置完成。

## 預設範例

攻擊 12、防禦 15、HP 12：

- 總和：39 / 45
- IV：87%
- 名稱：`亮班⁸⁷⓬⓯⓬`
