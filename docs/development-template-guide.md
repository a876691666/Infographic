# 信息图模板开发指南

## 🚀 快速开始

### 1. 数据项 (Items) 开发 (5分钟)

数据项是信息图的基本展示单元，负责单个数据元素的视觉呈现。

#### 创建新的数据项

1. **文件位置**: `packages/infographic/src/designs/items/`
2. **命名规范**: 大驼峰命名，如 `ProgressCard.tsx`
3. **注册名**: 小写连字符，如 `progress-card`

#### 数据项模板

```typescript
/** @jsxImportSource @antv/infographic-jsx */
import { ComponentType, Group } from '@antv/infographic-jsx';
import { ItemLabel, ItemDesc, ItemIcon, ItemValue } from '../components';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';
import { getItemProps } from './utils';

export interface MyItemProps extends BaseItemProps {
  width?: number;
  height?: number;
  iconSize?: number;
}

export const MyItem: ComponentType<MyItemProps> = (props) => {
  const [
    {
      datum,
      indexes,
      width = 300,
      height = 80,
      iconSize = 32,
      themeColors,
    },
    restProps,
  ] = getItemProps(props, ['width', 'height', 'iconSize']);

  return (
    <Group {...restProps}>
      {/* 背景 */}
      <Rect x={0} y={0} width={width} height={height} fill={themeColors.colorBgElevated} rx={8} />

      {/* 图标 */}
      {datum.icon && (
        <ItemIcon indexes={indexes} x={16} y={24} size={iconSize} />
      )}

      {/* 标签 */}
      <ItemLabel indexes={indexes} x={64} y={20}>
        {datum.label}
      </ItemLabel>

      {/* 数值 */}
      {datum.value !== undefined && (
        <ItemValue indexes={indexes} value={datum.value} x={64} y={40} />
      )}

      {/* 描述 */}
      {datum.desc && (
        <ItemDesc indexes={indexes} x={64} y={datum.value ? 60 : 40}>
          {datum.desc}
        </ItemDesc>
      )}
    </Group>
  );
};

registerItem('my-item', { component: MyItem });
```

#### 现有数据项列表

| 名称               | 描述           | 文件                   |
| ------------------ | -------------- | ---------------------- |
| `BadgeCard`        | 徽章卡片样式   | `BadgeCard.tsx`        |
| `CandyCardLite`    | 糖果卡片轻量版 | `CandyCardLite.tsx`    |
| `ChartColumn`      | 柱状图表       | `ChartColumn.tsx`      |
| `CircleNode`       | 圆形节点       | `CircleNode.tsx`       |
| `CircularProgress` | 环形进度条     | `CircularProgress.tsx` |
| `CompactCard`      | 紧凑卡片       | `CompactCard.tsx`      |
| `DoneList`         | 完成列表项     | `DoneList.tsx`         |
| `ProgressCard`     | 进度卡片       | `ProgressCard.tsx`     |
| `RibbonCard`       | 丝带卡片       | `RibbonCard.tsx`       |
| `SimpleItem`       | 简洁数据项     | `SimpleItem.tsx`       |

### 2. 结构 (Structures) 开发 (5分钟)

结构定义了数据项的组织方式和整体布局。

#### 结构分类体系

| 类型     | 前缀         | 描述             | 示例                                   |
| -------- | ------------ | ---------------- | -------------------------------------- |
| 列表结构 | `list-`      | 并列排布         | `list-column`, `list-row`              |
| 对比结构 | `compare-`   | 二元/多元对比    | `compare-left-right`, `compare-mirror` |
| 顺序结构 | `sequence-`  | 有方向性的信息流 | `sequence-timeline`, `sequence-steps`  |
| 层级结构 | `hierarchy-` | 树状/嵌套关系    | `hierarchy-tree`, `hierarchy-pyramid`  |
| 关系结构 | `relation-`  | 元素间连接关系   | `relation-network`, `relation-circle`  |

#### 创建新的结构

1. **文件位置**: `packages/infographic/src/designs/structures/`
2. **命名规范**: 大驼峰命名，如 `ListGrid.tsx`
3. **注册名**: 小写连字符，如 `list-grid`

#### 结构模板

```typescript
/** @jsxImportSource @antv/infographic-jsx */
import type { ComponentType } from '@antv/infographic-jsx';
import { FlexLayout } from '../layouts';
import { Title, ItemsGroup, BtnAdd, BtnRemove, BtnsGroup } from '../components';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';
import { getElementBounds } from '@antv/infographic-jsx';

export interface ListGridProps extends BaseStructureProps {
  gap?: number;
  columns?: number;
}

export const ListGrid: ComponentType<ListGridProps> = (props) => {
  const { Title: TitleComponent, Item, data, gap = 20, columns = 3 } = props;
  const { title, desc, items = [] } = data;

  // 标题处理
  const titleContent = TitleComponent ? (
    <TitleComponent title={title} desc={desc} />
  ) : null;

  // 计算元素尺寸
  const itemBounds = getElementBounds(
    <Item indexes={[0]} data={data} datum={items[0]} />
  );

  // 准备元素数组
  const itemElements = [];
  const btnElements = [];

  // 生成数据项和按钮
  items.forEach((item, index) => {
    const indexes = [index];
    const row = Math.floor(index / columns);
    const col = index % columns;

    const x = col * (itemBounds.width + gap);
    const y = row * (itemBounds.height + gap);

    itemElements.push(
      <Item
        key={index}
        indexes={indexes}
        datum={item}
        data={data}
        x={x}
        y={y}
      />
    );

    btnElements.push(
      <BtnRemove
        indexes={indexes}
        x={x + itemBounds.width - 20}
        y={y - 10}
      />
    );

    btnElements.push(
      <BtnAdd
        indexes={[index + 1]}
        x={x + itemBounds.width / 2}
        y={y + itemBounds.height + 10}
      />
    );
  });

  // 末尾添加按钮
  if (items.length > 0) {
    const lastIndex = items.length;
    const row = Math.floor(lastIndex / columns);
    const col = lastIndex % columns;

    btnElements.push(
      <BtnAdd
        indexes={[lastIndex]}
        x={col * (itemBounds.width + gap) + itemBounds.width / 2}
        y={row * (itemBounds.height + gap) + 10}
      />
    );
  }

  return (
    <FlexLayout flexDirection="column" alignItems="center">
      {titleContent}
      <Group>
        <ItemsGroup>{itemElements}</ItemsGroup>
        <BtnsGroup>{btnElements}</BtnsGroup>
      </Group>
    </FlexLayout>
  );
};

registerStructure('list-grid', { component: ListGrid });
```

#### 现有结构列表

| 名称                 | 类型 | 描述       | 文件                     |
| -------------------- | ---- | ---------- | ------------------------ |
| `list-column`        | 列表 | 纵向单列   | `list-column.tsx`        |
| `list-row`           | 列表 | 横向单行   | `list-row.tsx`           |
| `list-grid`          | 列表 | 网格布局   | `list-grid.tsx`          |
| `list-waterfall`     | 列表 | 瀑布流     | `list-waterfall.tsx`     |
| `compare-left-right` | 对比 | 左右对比   | `compare-left-right.tsx` |
| `compare-mirror`     | 对比 | 镜像对比   | `compare-mirror.tsx`     |
| `hierarchy-tree`     | 层级 | 树形结构   | `hierarchy-tree.tsx`     |
| `hierarchy-pyramid`  | 层级 | 金字塔结构 | `hierarchy-pyramid.tsx`  |
| `sequence-timeline`  | 顺序 | 时间轴     | `sequence-timeline.tsx`  |
| `sequence-steps`     | 顺序 | 步骤流程   | `sequence-steps.tsx`     |
| `relation-network`   | 关系 | 网络图     | `relation-network.tsx`   |
| `relation-circle`    | 关系 | 循环关系   | `relation-circle.tsx`    |

## 📋 组件速查

### 数据项组件

| 组件          | 导入                     | 用途     |
| ------------- | ------------------------ | -------- |
| **ItemLabel** | `infographic/components` | 标签文本 |
| **ItemDesc**  | `infographic/components` | 描述文本 |
| **ItemIcon**  | `infographic/components` | 图标显示 |
| **ItemValue** | `infographic/components` | 数值显示 |

### 结构组件

| 组件           | 导入                     | 用途       |
| -------------- | ------------------------ | ---------- |
| **Title**      | `infographic/components` | 标题组件   |
| **ItemsGroup** | `infographic/components` | 数据项容器 |
| **BtnAdd**     | `infographic/components` | 添加按钮   |
| **BtnRemove**  | `infographic/components` | 删除按钮   |
| **BtnsGroup**  | `infographic/components` | 按钮容器   |

### 布局组件

| 组件           | 导入                    | 用途     |
| -------------- | ----------------------- | -------- |
| **FlexLayout** | `infographic/layouts`   | 弹性布局 |
| **Group**      | `@antv/infographic-jsx` | 分组容器 |

### 图形组件

| 组件       | 导入                    | 用途 |
| ---------- | ----------------------- | ---- |
| **Rect**   | `@antv/infographic-jsx` | 矩形 |
| **Circle** | `@antv/infographic-jsx` | 圆形 |
| **Text**   | `@antv/infographic-jsx` | 文本 |
| **Path**   | `@antv/infographic-jsx` | 路径 |

## 🎨 主题系统

### 主题色彩

```typescript
interface ThemeColors {
  colorPrimary: string; // 主色调
  colorPrimaryBg: string; // 主色背景
  colorPrimaryText: string; // 主色文本
  colorText: string; // 主要文本
  colorTextSecondary: string; // 次要文本
  colorWhite: string; // 纯白色
  colorBg: string; // 背景色
  colorBgElevated: string; // 卡片背景
}
```

### 使用主题色彩

```typescript
// 在数据项中使用
<Rect fill={themeColors.colorPrimaryBg} />
<Text fill={themeColors.colorText} />

// 渐变示例
<Defs>
  <linearGradient id="gradient">
    <stop offset="0%" stopColor={themeColors.colorPrimary} />
    <stop offset="100%" stopColor={tinycolor(themeColors.colorPrimary).lighten(20).toHexString()} />
  </linearGradient>
</Defs>
```

## 📊 数据格式

### 数据结构

```typescript
interface Data {
  title?: string; // 标题
  desc?: string; // 描述
  items: ItemDatum[]; // 数据项数组
  illus?: Record<string, string | ResourceConfig>; // 插图资源
}

interface ItemDatum {
  icon?: string | ResourceConfig; // 图标
  label?: string; // 标签
  desc?: string; // 描述
  value?: number; // 数值
  illus?: string | ResourceConfig; // 插图
  children?: ItemDatum[]; // 子项（层级结构）
}
```

### 示例数据

```typescript
const sampleData = {
  title: '项目进度',
  desc: '2024年Q1项目完成情况',
  items: [
    {
      label: '需求分析',
      desc: '完成用户需求调研和分析',
      value: 100,
      icon: 'check-circle',
    },
    {
      label: 'UI设计',
      desc: '完成界面设计和原型',
      value: 85,
      icon: 'palette',
    },
    {
      label: '开发实现',
      desc: '功能开发和单元测试',
      value: 60,
      icon: 'code',
    },
  ],
};
```

## 🔧 工具函数

### getItemProps

```typescript
const [props, rest] = getItemProps(rawProps, ['width', 'height']);
// props: 包含所有标准属性 + 自定义属性
// rest: 剩余的props，传给最外层Group
```

### getElementBounds

```typescript
const bounds = getElementBounds(<ItemLabel indexes={indexes} />);
// bounds: { x, y, width, height }
```

### getItemId

```typescript
const id = getItemId(indexes, 'shape', 'item');
// 生成: "item-0-shape-item"
```

## 🧪 调试技巧

### 1. 添加调试边框

```typescript
<Rect stroke="red" strokeWidth={1} fill="none" />
```

### 2. 控制台调试

```typescript
console.log('Position:', { x, y, width, height });
```

### 3. 浏览器调试

- 使用开发者工具检查SVG
- 查看元素边界框
- 调试布局计算
