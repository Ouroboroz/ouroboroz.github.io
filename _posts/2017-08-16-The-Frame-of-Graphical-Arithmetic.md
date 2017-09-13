---
layout: post
title: "The Frame of Graphical Arithmetic"
date: 2017-08-16
---
With finals and my motivation finally gone(although the latter has been gone for quite a long time now), I finally can be lazy again. Just yesterday in Graph Theory, I came across a interesting problem: whether $$G \times C_4$$ had a Hamiltonian path if $$G$$ is Hamiltonian. So here is the point where you start asking the very important question: that problem is quite trivial, what is so hard about it? Or atleast thats what I asked myself right now.

As always, I have been asking myself rhetorical questions that I already knew the answer to since I am writing this post. Anyways, I'm glad you asked. Well you see, while you don't need to prove the following lemma to proceed with the question, but it provides you with a direction to work in. The lemma goes as follows: $$G \times K_2$$ contains a Hamiltonian path if $$G$$ contains a Hamiltonian path. The proof of this lemma is quite simple. Can group the vertex set of $$G \times K_2$$ into a sets of vertices and edges composing $$G_1$$ and $$G_2$$ where $$G_1,G_2 \cong G$$ and a set of edges that are incident with two corresponding vertices. Since $$G_1 \cong G$$, there exists a Hamiltonian path from, WLOG, vertice $$v_1$$ to vertice $$u_2$$ in $$G_1$$. We know there exists edges from $$v_1$$ to $$v_2$$ and $$u_1$$ to $$u_2$$ in $$G \times K_2$$. Furthermore, since $$G_2 \cong G \cong G_1$$, WLOG, there exists an Hamiltonian path from $$u_2$$ to $$v_2$$. Thus for the Hamiltonian cycle in $$G \times K_2$$, we simply take the cycle: $$(v_1, ..., u_1, u_2, ..., v_2, v_1)$$. 

But how does this lemma help? If $$\exists$$ a graph $$H = G \times K_2$$ then we notice that $$G \times C_4 = H \times K_2 = G \times K_2 \times K_2$$. I noticed that $$C_4 = K_2 \times K_2$$. From this observation, I started to question: does the associative property hold for the sum and multiplcation of graphs? Just by that single example, it is pretty obvious that the associative property does hold for graphs: $$G \times H \times J = (G \times H) \times J = G \times (H \times J)$$. The proof of this is easy but long. It just involves the labeling of each vertex and how it doesn't matter what order one labels the vertices since only the corresponding vertices are connected.

So now this got me thinking? If the associative property holds for multiplication, then does any other property hold? and if it would hold for addition. While we still are at the associate property, let us analyze the associative property for addition. 