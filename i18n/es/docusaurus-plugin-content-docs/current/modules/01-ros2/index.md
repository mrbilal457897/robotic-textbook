---
sidebar_position: 1
sidebar_label: 'Módulo 1: ROS 2'
title: 'Módulo 1: Sistema Nervioso Robótico (ROS 2)'
description: 'Aprende conceptos básicos de ROS 2, el middleware que potencia los sistemas de robótica humanoide modernos'
---

# Módulo 1: Sistema Nervioso Robótico (ROS 2)

**Tiempo de lectura:** ~5 minutos
**Nivel de dificultad:** Principiante a Intermedio

## Descripción general

Cada robot humanoide—ya sea navegando en un almacén, asistiendo en cuidados de salud o explorando entornos peligrosos—depende de un sofisticado sistema nervioso para coordinar sensores, actuadores y algoritmos de toma de decisiones. ROS 2 (Robot Operating System 2) actúa como este sistema nervioso, proporcionando la infraestructura middleware que habilita la comunicación distribuida, el diseño modular y el control en tiempo real en complejas plataformas robóticas.

A diferencia de su predecesor ROS 1, ROS 2 se construye sobre el estándar Data Distribution Service (DDS), ofreciendo comunicación determinista, seguridad mejorada y soporte nativo para sistemas multirobótico. Esto lo convierte en el estándar de facto para la robótica humanoide moderna, donde los subsistemas deben coordinarse con precisión de milisegundos—desde algoritmos de equilibrio que ajustan torques de articulaciones hasta sistemas de visión que alimentan datos de detección de objetos a planificadores de manipulación.

En este módulo, aprenderás cómo ROS 2 habilita arquitecturas de robots modulares y escalables. Descubrirás cómo los nodos se comunican a través de tópicos y servicios, cómo programar comportamientos de robots usando la librería rclpy de Python, y cómo modelar estructuras de robots humanoides usando el Unified Robot Description Format (URDF). Al adoptar un enfoque simulación-primero, obtendrás experiencia práctica con estos conceptos en entornos seguros y reproducibles antes de tocar hardware físico.

Ya sea que estés construyendo pipelines de percepción, sistemas de planificación de movimiento o aplicaciones humanoides de pila completa, dominar ROS 2 es esencial. Este módulo proporciona el conocimiento fundamental y las habilidades prácticas para diseñar, implementar y depurar sistemas robóticos distribuidos con confianza.

## Objetivos de aprendizaje

Al final de este módulo, podrás:

- **Explicar** la arquitectura de ROS 2, incluyendo la abstracción middleware de DDS, gestión del ciclo de vida de nodos, y la distinción entre tópicos, servicios y acciones
- **Implementar** nodos de ROS 2 que se comuniquen a través de patrones publicador-suscriptor (tópicos) y solicitud-respuesta (servicios) usando la librería rclpy de Python
- **Crear** modelos URDF para robots humanoides, definiendo cadenas cinemáticas, tipos de articulaciones, geometrías de colisión y representaciones visuales
- **Aplicar** mejores prácticas de ROS 2 como gestión de espacios de nombres, configuración de parámetros y composición para diseño modular del sistema
- **Analizar** gráficos de comunicación de ROS 2 usando herramientas de introspección (ros2 topic, ros2 node, rqt_graph) para depurar flujo de datos e identificar cuellos de botella

## Contenido del módulo

Este módulo se estructura en tres temas progresivos, cada uno construido sobre el anterior:

1. **[Nodos, Tópicos y Servicios](./01-nodes-topics-services.md)** — Comprende el modelo de comunicación de ROS 2, incluyendo patrones publicador-suscriptor para datos en streaming y patrones cliente-servidor para solicitudes bajo demanda. Aprende cómo interactúan los nodos, cómo diseñar interfaces de tópicos, y cuándo usar servicios versus tópicos.

2. **[Python con rclpy](./02-python-rclpy.md)** — Escribe aplicaciones robustas de ROS 2 usando la librería rclpy de Python. Explora inicialización de nodos, callbacks de ciclo de vida, manejo de parámetros, ejecución basada en temporizador, y políticas de calidad de servicio (QoS) para comunicación confiable.

3. **[URDF para Humanoides](./03-urdf-humanoids.md)** — Modela estructuras de robots humanoides usando URDF, definiendo enlaces, articulaciones, propiedades de masa y colocaciones de sensores. Aprende cómo visualizar modelos en RViz, integrarlos con Gazebo o Isaac Sim, y diseñar cadenas cinemáticas para locomoción bípeda y manipulación.

## Requisitos previos

Antes de comenzar este módulo, deberías tener:

- **Programación en Python:** Dominio de la sintaxis de Python 3, programación orientada a objetos (clases, herencia) y conceptos básicos de concurrencia (callbacks, patrones asincronía)
- **Línea de comandos de Linux:** Familiaridad con navegación de terminal, manipulación de archivos, gestión de paquetes (apt) y variables de entorno
- **Fundamentos de Robótica:** Comprensión básica de marcos de coordenadas, cinemática, sensores (IMU, cámaras, LiDAR) y actuadores (motores, servos)
- **Entorno de desarrollo:** ROS 2 (Humble o posterior) instalado en Ubuntu 22.04 o equivalente, o acceso a un entorno ROS 2 contenedorizado

Si eres nuevo en alguno de estos temas, recomendamos revisar recursos introductorios antes de continuar. El módulo asume que puedes escribir y ejecutar scripts de Python y que te sientes cómodo trabajando en una terminal de Linux.

## Tiempo estimado de finalización

⏱️ **8-10 horas** para completar este módulo, incluyendo:

- Lectura y comprensión de conceptos principales (~3 horas)
- Ejercicios prácticos de codificación y ejemplos (~4 horas)
- Depuración, experimentación y exploración (~2-3 horas)

Esta estimación asume familiaridad previa con los requisitos previos. Ajusta tu ritmo basándote en tu trasfondo y estilo de aprendizaje.

## Por qué esto importa para la Robótica Humanoide

Los robots humanoides presentan desafíos únicos: operan en entornos humanos no estructurados, requieren bucles sensor-actuador estrechos para equilibrio, y deben coordinar docenas de grados de libertad en tiempo real. El middleware basado en DDS de ROS 2 proporciona:

- **Rendimiento en tiempo real:** Comunicación determinista para bucles de control críticos en tiempo (p. ej., estabilización de equilibrio a 100+ Hz)
- **Modularidad:** Nodos independientes para percepción, planificación y control habilitan prototipado rápido y desarrollo paralelo
- **Interoperabilidad:** Tipos de mensajes estandarizados y herramientas permiten integración con librerías de terceros (MoveIt, Nav2, Isaac SDK)
- **Escalabilidad:** La arquitectura distribuida soporta coordinación multirobótica y descargas de computación basadas en la nube

Al dominar ROS 2 en simulación (Gazebo, Isaac Sim), desarrollarás habilidades que se transfieren directamente a plataformas físicas—evitando fallos de hardware costosos durante el proceso de aprendizaje.

---

## ¿Listo para comenzar?

Inicia tu viaje en el sistema nervioso robótico con **[Nodos, Tópicos y Servicios](./01-nodes-topics-services.md)**, donde construirás tu primer gráfico de comunicación de ROS 2 y comprenderás cómo los sistemas distribuidos se coordinan en tiempo real.
