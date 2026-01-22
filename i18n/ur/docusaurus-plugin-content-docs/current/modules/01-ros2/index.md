---
sidebar_position: 1
sidebar_label: 'ماڈیول 1: ROS 2'
title: 'ماڈیول 1: روبوٹک اعصابی نظام (ROS 2)'
description: 'ROS 2 کی بنیادی باتیں سیکھیں، جدید ہیومنائیڈ روبوٹکس سسٹم میں طاقت'
---

# ماڈیول 1: روبوٹک اعصابی نظام (ROS 2)

**پڑھنے کا وقت:** ~5 منٹ
**مشکل کی سطح:** ابتدائی سے درمیانی

## جائزہ

ہر ہیومنائیڈ روبوٹ—چاہے وہ گودام میں نیویگیٹ کر رہا ہو، صحت کی دیکھ بھال میں مدد فراہم کر رہا ہو، یا خطرناک ماحول کی تلاش میں ہو—ایک نفیس اعصابی نظام پر منحصر ہے تاکہ سینسرز، ایکچویٹرز، اور فیصلہ سازی کے الگورتھم میں ہم آہنگی ہو۔ ROS 2 (روبوٹ آپریٹنگ سسٹم 2) اس اعصابی نظام کے طور پر کام کرتا ہے، جو Distributed کمیونیکیشن، ماڈیولر ڈیزائن، اور پیچیدہ روبوٹک پلیٹ فارمز میں رئیل ٹائم کنٹرول فراہم کرتا ہے۔

اپنے پیشروا ROS 1 کے برعکس، ROS 2 Data Distribution Service (DDS) معیار پر بنایا گیا ہے، جو Deterministic کمیونیکیشن، بہتر سیکیورٹی، اور Multi-robot سسٹم کے لیے native سپورٹ فراہم کرتا ہے۔ یہ جدید ہیومنائیڈ روبوٹکس میں معیاری انتخاب ہے، جہاں ذیلی نظام Millisecond precision کے ساتھ ہم آہنگ ہونے چاہیں—توازن کے الگورتھم سے جو joint torques کو ایڈجسٹ کرتے ہیں تا کہ Vision سسٹم object detection ڈیٹا کو manipulation planners کو فیڈ کر رہے ہوں۔

اس ماڈیول میں، آپ سیکھیں گے کہ کیسے ROS 2 ماڈیولر، قابل توسیع روبوٹ آرکیٹیکچرز کو متاثر کرتا ہے۔ آپ دریافت کریں گے کہ نوڈز Topics اور Services کے ذریعے کیسے کمیونیکیٹ کرتے ہیں، Python کی rclpy لائبریری استعمال کرتے ہوئے روبوٹ رویہ کو کیسے پروگرام کریں، اور Unified Robot Description Format (URDF) استعمال کرتے ہوئے ہیومنائیڈ روبوٹ ڈھانچے کو کیسے ماڈل کریں۔ Simulation-first approach اپناتے ہوئے، آپ کو ان تصورات کے ساتھ محفوظ، دوہری ماحول میں عملی تجربہ حاصل ہوگا۔

چاہے آپ Perception pipelines بنا رہے ہوں، Motion planning سسٹم، یا مکمل Humanoid applications، ROS 2 میں مہارت ہاصل کرنا ضروری ہے۔ یہ ماڈیول Distributed robotic سسٹم کو اعتماد کے ساتھ ڈیزائن، implement، اور debug کرنے کے لیے بنیادی علم اور عملی مہارت فراہم کرتا ہے۔

## سیکھنے کے مقاصد

اس ماڈیول کی اختتام میں، آپ یہ کام کر سکیں گے:

- **وضاحت** ROS 2 کے آرکیٹیکچر کی، بشمول DDS middleware abstraction، node lifecycle management، اور topics، services، اور actions کے درمیان فرق
- **Implement** ROS 2 نوڈز جو publish-subscribe (topics) اور request-response (services) patterns کے ذریعے Python کی rclpy لائبریری استعمال کرتے ہوئے کمیونیکیٹ کرتے ہیں
- **بنائیں** ہیومنائیڈ روبوٹ کے URDF ماڈلز، kinematic chains، joint types، collision geometries، اور visual representations کی تعریف کرتے ہوئے
- **استعمال** ROS 2 بہترین طریقے جیسے namespace management، parameter configuration، اور composition modular system design کے لیے
- **تجزیہ** ROS 2 کمیونیکیشن گرافز Introspection tools (ros2 topic، ros2 node، rqt_graph) استعمال کرتے ہوئے ڈیٹا flow اور bottlenecks کو debug کرنے کے لیے

## ماڈیول کا مواد

یہ ماڈیول تین ترقی پذیر عنوانات میں ڈھانچہ بندی ہے، ہر ایک پچھلے پر بنتا ہے:

1. **[Nodes، Topics، اور Services](./01-nodes-topics-services.md)** — ROS 2 کمیونیکیشن ماڈل کو سمجھیں، بشمول publisher-subscriber patterns streaming ڈیٹا کے لیے اور client-server patterns on-demand requests کے لیے۔ سیکھیں کہ نوڈز کیسے interact کرتے ہیں، topic interfaces کو کیسے ڈیزائن کریں، اور services بمقابلہ topics کب استعمال کریں۔

2. **[Python with rclpy](./02-python-rclpy.md)** — Python کی rclpy لائبریری استعمال کرتے ہوئے robust ROS 2 applications لکھیں۔ Node initialization، lifecycle callbacks، parameter handling، timer-based execution، اور quality-of-service (QoS) policies reliable کمیونیکیشن کے لیے explore کریں۔

3. **[URDF for Humanoids](./03-urdf-humanoids.md)** — URDF استعمال کرتے ہوئے ہیومنائیڈ روبوٹ ڈھانچے کو ماڈل کریں، links، joints، mass properties، اور sensor placements کی تعریف کرتے ہوئے۔ RViz میں ماڈلز کو visualize کریں، انہیں Gazebo یا Isaac Sim کے ساتھ integrate کریں، اور bipedal locomotion اور manipulation کے لیے kinematic chains ڈیزائن کریں۔

## Prerequisite

اس ماڈیول کو شروع کرنے سے پہلے، آپ کے پاس ہونا چاہیے:

- **Python Programming:** Python 3 syntax، object-oriented programming (classes، inheritance)، اور بنیادی concurrency concepts (callbacks، async patterns) میں مہارت
- **Linux Command Line:** Terminal navigation، file manipulation، package management (apt)، اور environment variables سے واقفیت
- **Robotics Fundamentals:** Coordinate frames، kinematics، sensors (IMUs، cameras، LiDAR)، اور actuators (motors، servos) کی بنیادی سمجھ
- **Development Environment:** ROS 2 (Humble یا بعد میں) Ubuntu 22.04 یا مساوی پر installed، یا containerized ROS 2 environment تک رسائی

اگر آپ ان میں سے کسی سے نئے ہیں، تو ہم آگے بڑھنے سے پہلے introductory resources کا جائزہ لینے کی تجویز دیتے ہیں۔ ماڈیول فرض کرتا ہے کہ آپ Python scripts لکھ اور چلا سکتے ہیں اور Linux terminal میں آرام دہ ہیں۔

## متوقع مکمل ہونے کا وقت

⏱️ **8-10 گھنٹے** اس ماڈیول کو مکمل کرنے کے لیے، بشمول:

- Core concepts کو پڑھنا اور سمجھنا (~3 گھنٹے)
- عملی coding exercises اور examples (~4 گھنٹے)
- Debugging، experimentation، اور exploration (~2-3 گھنٹے)

یہ تخمینہ prerequisites سے پہلے کی واقفیت فرض کرتا ہے۔ اپنی رفتار کو اپس background اور سیکھنے کے انداز کی بنیاد پر ایڈجسٹ کریں۔

## ہیومنائیڈ روبوٹکس کے لیے یہ کیوں اہم ہے

ہیومنائیڈ روبوٹ منفرد چیلنج پیش کرتے ہیں: وہ Unstructured انسانی ماحول میں کام کرتے ہیں، توازن کے لیے سخت sensor-actuator loops کی ضرورت ہے، اور Real-time میں درجنوں degrees of freedom میں ہم آہنگی کرنا ہے۔ ROS 2 کا DDS-based middleware یہ فراہم کرتا ہے:

- **Real-time performance:** Deterministic کمیونیکیشن time-critical کنٹرول loops کے لیے (مثال کے طور پر، توازن stabilization at 100+ Hz)
- **Modularity:** Independent نوڈز perception، planning، اور control کے لیے تیزی سے prototyping اور parallel development کو متاثر کرتے ہیں
- **Interoperability:** Standardized message types اور tools third-party libraries (MoveIt، Nav2، Isaac SDK) کے ساتھ integration کی اجازت دیتے ہیں
- **Scalability:** Distributed architecture multi-robot coordination اور cloud-based computation offloading کو سپورٹ کرتا ہے

ROS 2 کو simulation میں (Gazebo، Isaac Sim) میں master کرتے ہوئے، آپ مہارت تیار کریں گے جو براہ راست physical platforms میں منتقل ہو—سخت ہارڈویئر ناکامی کے دوران سیکھنے کے عمل میں اخراجات سے بچتے ہوئے۔

---

## شروع کرنے کے لیے تیار ہیں؟

روبوٹک اعصابی نظام میں اپنا سفر **[Nodes، Topics، اور Services](./01-nodes-topics-services.md)** کے ساتھ شروع کریں، جہاں آپ اپنی پہلی ROS 2 کمیونیکیشن graph بنائیں گے اور سمجھیں گے کہ distributed سسٹم Real time میں کیسے ہم آہنگی کرتے ہیں۔
