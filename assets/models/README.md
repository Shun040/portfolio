# 3D 模型放这里

沙盘里的六件物体会**优先加载这里的模型**，没有就用代码里拼的替身几何体。
所以模型可以随时补，不用改任何代码。

文件名必须和项目 key 一致：

| 文件 | 对应作品 | 现在的替身 |
|---|---|---|
| `tears.glb` | 眼泪先于语言 | 电话听筒 |
| `exstasis.glb` | EXSTASIS | 培养皿 + 菌落 |
| `painshift.glb` | PainShift | VR 头显 |
| `reground.glb` | Reground | 毛绒小鸟 |
| `empalens.glb` | EmpaLens | 眼镜 + 徽章 |
| `through-eyes.glb` | 以他人之眼 | 针孔摄像头 |

## 从 Blender 导出

File → Export → **glTF 2.0 (.glb)**
- 勾 **Compression（Draco）**
- 目标 **5MB 以内**，手机上才不卡
- 朝向：+Y 朝上，物体正面朝 +Z
- 尺寸不用管，代码会自动缩放到统一大小并让它坐在沙面上
