# T084: Manual QA Test Questions - Book-Only Mode

**Total Questions**: 50
**Mode**: Book-Only (no external knowledge)
**Purpose**: Validate response quality, relevance, citation accuracy, and error handling

---

## Category 1: Definition Questions (20)

Questions that ask "What is X?" - testing basic knowledge retrieval

1. What is inverse kinematics?
2. What is forward kinematics?
3. What is a Denavit-Hartenberg parameter?
4. What is a digital twin?
5. What is URDF?
6. What is SDF?
7. What is a trajectory in robotics?
8. What is an end-effector?
9. What is a joint space?
10. What is Cartesian space?
11. What is a humanoid robot?
12. What is a degree of freedom (DOF)?
13. What is a collision mesh?
14. What is a visual mesh?
15. What is Gazebo?
16. What is ROS 2?
17. What is NVIDIA Isaac Sim?
18. What is path planning?
19. What is motion planning?
20. What is a configuration space?

---

## Category 2: Explanation Questions (10)

Questions that ask "How does X work?" - testing deeper understanding

21. How does inverse kinematics work in robotic arms?
22. How do you create a URDF model for a robot?
23. How does ROS 2 differ from ROS 1?
24. How does collision detection work in Gazebo?
25. How do you simulate physics in Isaac Sim?
26. How does trajectory generation work for humanoid locomotion?
27. How do digital twins enable robot testing?
28. How does the Denavit-Hartenberg convention work?
29. How do you define joint limits in URDF?
30. How does real-time control work in robotics?

---

## Category 3: Comparison Questions (10)

Questions that compare two concepts - testing analytical reasoning

31. Compare forward kinematics and inverse kinematics.
32. Compare URDF and SDF formats.
33. Compare Gazebo and Isaac Sim.
34. Compare ROS 1 and ROS 2.
35. Compare joint space and Cartesian space.
36. Compare collision meshes and visual meshes.
37. Compare path planning and motion planning.
38. Compare revolute joints and prismatic joints.
39. Compare serial manipulators and parallel manipulators.
40. Compare open-loop control and closed-loop control.

---

## Category 4: Application Questions (5)

Questions that ask "How to use X?" - testing practical knowledge

41. How do I set up a ROS 2 workspace for a humanoid robot simulation?
42. How do I define a kinematic chain in URDF for a robotic arm?
43. How do I configure physics parameters in Gazebo for accurate simulation?
44. How do I implement a PID controller for joint position control?
45. How do I visualize robot trajectories in RViz?

---

## Category 5: Edge Cases and Challenging Questions (5)

Questions designed to test refusal, boundary cases, and error handling

46. What is the latest version of ROS 2? *(Tests temporal knowledge - should refuse if not in textbook)*
47. How do I deploy a robot to Mars? *(Tests out-of-scope topics - should refuse if not covered)*
48. What are the ethical implications of humanoid robots? *(Tests non-technical topics - may refuse)*
49. What is the best robot for manufacturing? *(Tests subjective questions - should refuse or cite textbook opinion)*
50. asdfghjkl *(Tests gibberish input - should handle gracefully)*

---

## Expected Behavior

### For Valid Questions (1-45):
- ✅ Response should be relevant and accurate
- ✅ Response should include 2-5 citations from textbook
- ✅ Response time should be < 3 seconds
- ✅ Citations should link to correct chapters/sections
- ✅ No hallucinations (all claims backed by citations)

### For Edge Cases (46-50):
- ✅ Should refuse gracefully when information not in textbook
- ✅ Should provide helpful message explaining limitation
- ✅ Should not fabricate answers
- ✅ Should handle gibberish input without crashing
- ✅ May provide partial answer if some information available

---

## Testing Instructions

1. **Setup**:
   - Ensure backend and frontend are running
   - Verify database has textbook content ingested
   - Open textbook chapter page (any chapter)
   - Open chat panel

2. **For Each Question**:
   - Type question exactly as written
   - Press Enter to submit
   - Record the following in results template:
     - Response time (visual estimate or DevTools Network tab)
     - Response quality (Poor/Fair/Good/Excellent)
     - Number of citations provided
     - Citation accuracy (spot check 1-2 citations)
     - Any errors or issues

3. **Validation Criteria**:
   - **Pass**: Response is accurate, relevant, includes citations, < 3s response time
   - **Fail**: Response is inaccurate, irrelevant, no citations, or slow (> 3s)
   - **Partial**: Response is partially correct but has minor issues

4. **Overall Success Criteria**:
   - ✅ 90%+ questions pass (45+ out of 50)
   - ✅ Average response time < 3s
   - ✅ All valid questions include citations
   - ✅ No crashes or UI errors

---

## Notes

- **Test Environment**: Local development (or staging if deployed)
- **Date**: [Fill in when tested]
- **Tester**: [Fill in name]
- **Database State**: [Note if using real or sample data]
- **Results File**: `T084-manual-qa-results.md`
