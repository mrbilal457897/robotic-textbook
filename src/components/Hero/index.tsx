/**
 * Hero Section Component
 * Physical AI & Humanoid Robotics Interactive Textbook
 *
 * Features:
 * - Title with gradient effect
 * - Subtitle and CTA description
 * - "Start Reading" button (primary) linking to Module 1
 * - "Login with GitHub" button (secondary, functional in US4)
 * - Animated neural grid background
 * - Floating particles effect
 * - Entrance animations on mount
 */

import React, { useEffect, useRef } from 'react';
import Link from '@docusaurus/Link';
import { LoginButton } from '../Auth/LoginButton';
import { UserProfile } from '../Auth/UserProfile';
import { useAuth } from '../../hooks/useAuth';
import styles from './styles.module.css';

export default function Hero(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update(canvasWidth: number, canvasHeight: number) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvasWidth) this.vx *= -1;
        if (this.y < 0 || this.y > canvasHeight) this.vy *= -1;
      }

      draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
        context.fill();
      }
    }

    // Initialize particles
    const particles: Particle[] = [];
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      particles.forEach(particle => {
        particle.update(canvas.width, canvas.height);
        particle.draw(ctx);
      });

      // Draw connections between nearby particles
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const opacity = (1 - distance / 150) * 0.2;
            ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      {/* Animated Background Canvas */}
      <canvas ref={canvasRef} className={styles.heroCanvas} aria-hidden="true" />

      {/* Neural Grid Background */}
      <div className={styles.neuralGrid} aria-hidden="true" />

      {/* Hero Content */}
      <div className={styles.heroContent}>
        <h1 id="hero-title" className={`${styles.heroTitle} animate-fadeInUp`}>
          <span className={styles.heroTitleGradient}>Physical AI & Humanoid Robotics</span>
        </h1>

        <p className={`${styles.heroSubtitle} animate-fadeInUp`} style={{ animationDelay: '0.2s' }}>
          Bridging the gap between digital minds and physical bodies
        </p>

        <p
          className={`${styles.heroDescription} animate-fadeInUp`}
          style={{ animationDelay: '0.4s' }}
        >
          Master the cutting-edge technologies powering the next generation of humanoid robots. From
          ROS 2 fundamentals to vision-language-action models, this comprehensive textbook guides
          you through the complete Physical AI stack with hands-on simulations and real-world
          applications.
        </p>

        <div
          className={`${styles.heroActions} animate-fadeInUp`}
          style={{ animationDelay: '0.6s' }}
        >
          <Link
            to="/docs/intro"
            className={`${styles.heroPrimaryButton} btn-primary`}
            aria-label="Start reading the textbook"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4 2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M8 6h4M8 10h4M8 14h2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Start Reading
          </Link>

          {isAuthenticated && user ? (
            <div className={styles.heroUserProfile}>
              <UserProfile user={user} onLogout={logout} />
            </div>
          ) : (
            <LoginButton disabled={false} />
          )}
        </div>

        {/* Scroll Indicator */}
        <div className={`${styles.scrollIndicator} animate-bounce`} aria-hidden="true">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5v14m0 0l-7-7m7 7l7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
