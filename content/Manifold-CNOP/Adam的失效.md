---
date: 2026-09-03
---
在 Manifold-CNOP 的实验中，我使用了直接物理空间扰动，也就是C组实验作为对照。然而该对照组最开始的优化结果甚至比不上 Manifold-CNOP ——这显然是错误的，毕竟，Manifold-CNOP 比C组多了一道流形约束，其优化空间为C组优化空间的子集，求得的 CNOP 不可能优于C组。

经过了一番调查，最终将该原因定位到了优化器——Adam上。本文用于解释为什么Adam优化器会招致恶劣的优化结果。下表为针对CESM2-1995的优化器消融实验表：

| 优化器                                    | J           |
| -------------------------------------- | ----------- |
| C 臂（Adam, lr=1e-3, 默认 β, 200 步, 24 起点） | **+0.067**  |
| 一阶上界 J(εĝ)                             | +0.435      |
| **SGD（lr=2e-2, 从零, 200 步）**            | **+0.4351** |
### 问题设定：L2球上的线性化上升问题

C 在物理空间 $\delta x\in\mathbb{R}^N$（$N=2\times180\times360=129600$，SST+ZOS 两通道）上做约束上升：
$$

\max_{\delta x}\; J(\delta x)

\quad\text{s.t.}\quad

\|\delta x\|_{\mathrm{RMS}} \le \varepsilon,

\qquad

\|\delta x\|_{\mathrm{RMS}} \equiv \sqrt{\tfrac1N\textstyle\sum_i \delta x_i^2}

$$
其中 $J$ 是 WalkerNet 12 个月滚动预报的 lead-12 Niño3.4 异常减 baseline。

这个问题的特殊性在于，经过实际度量，J实际上是随着$\delta$ 线性变化的。在由constraint划出的L2球面上，$\delta$ 朝着任意一个方向移动，J的变化都与其步长基本成正比：
$$J(\delta) \approx J_0 + \langle g, \delta\rangle, \qquad  g = \nabla J|_0$$无论扰动被优化到了哪里，收到的梯度始终是不变的。建立在这样的线性事实上，能够推算出一阶上界 $J(\varepsilon\hat g) = +0.4348$。接下来的问题是——优化器是否能走到这个上界。

### Adam的实际移动方向

Adam的更新公式：
$$

\begin{aligned}

m_t &= \beta_1 m_{t-1} + (1-\beta_1) g_t \\ 

v_t &= \beta_2 v_{t-1} + (1-\beta_2) g_t^2 \\

\delta x_{t+1} &= \delta x_t - \mathrm{lr}\cdot\frac{m_t}{\sqrt{v_t}}

\end{aligned} \tag{1}

$$
由于 $g$ 始终是相同的，$m_t$ 展开后得到一个简单的等比数列求和公式，公比为 $1 - \beta_1$ ，求和：
$$m_t = (1-\beta_1) \frac{1-\beta_1^t}{1-\beta_1}g $$
显然，收敛后 $m_t = g$ 。同理 $v_t$ 收敛后的值为 $g^2$ ，二者都是常量。

那么 $(1)$ 中的公式简化为：
$$\delta x_{t+1} = \delta x_t - lr\cdot \frac{g}{\sqrt{g^2}}$$
所谓$\frac{g}{\sqrt{g^2}}$ ，简单而言，就是将原本每个格点的梯度信号的幅度全部抹平，只保留正负符号——随后去更新——我们称这个方向为$sign(g)$。

### SGD的移动

SGD的移动就很易于阐述了。作为经典梯度下降算法，SGD根据当前反向传来的梯度更新参数：
$$\delta x_{t+1} = \delta x_t - lr \cdot g$$
相对于Adam，它完整地保留了幅值——这导致它的更新方式异常简洁而又鲁莽——但是在这个纯粹的线性问题中，它无比正确，因为，它不需要考虑在这一步之后梯度会变成什么样，梯度永远是固定的，只要一直朝着最激进的方向走，就一定能最快到达最小值。

### 错配

我们已经推导了Adam的优化方向，以及SGD在这个问题中的适用性。接下来解释Adam到底偏离了多少。

需要重申的是，Adam和SGD在这个问题中都会在收敛后沿着固定的优化方向一直走，所以我们只需要计算一次 $sign(g)$ 与 $\hat g$ 的夹角，就可以判断Adam在整个过程中的偏移：
$$||sign(g)||_2 = \sqrt{N}, \qquad \langle sign(g), \hat g \rangle = \frac{1}{||g||_2} \sum_i|g_i| = \frac{||g||_1}{||g||_2}$$
$$
\boxed{\;
\cos\!\big(\mathrm{sign}(g),\ \hat g\big)
= \frac{\langle \mathrm{sign}(g), \hat g\rangle}{\sqrt{N}}
= \frac{\|g\|_1}{\sqrt{N}\,\|g\|_2}
\;}
$$
其中 $N$ 是格点数。

在CESM2-1995，这个cos值为0.196——接近正交。导致了表中的结果：

| 优化器                                    | J           |
| -------------------------------------- | ----------- |
| C 臂（Adam, lr=1e-3, 默认 β, 200 步, 24 起点） | **+0.067**  |
| 一阶上界 J(εĝ)                             | +0.435      |
| **SGD（lr=2e-2, 从零, 200 步）**            | **+0.4351** |

值得注意的是，Adam这个0.067并不是陷入了局部最优解，这是一个解析解。