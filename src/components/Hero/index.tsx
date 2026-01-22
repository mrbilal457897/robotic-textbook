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
import styles from './styles.module.css';

export default function Hero(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      particles.forEach((particle) => {
        particle.update(canvas.width, canvas.height);
        particle.draw(ctx);
      });

      // Draw connections between nearby particles
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
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
          <span className={styles.heroTitleGradient}>
            Physical AI & Humanoid Robotics
          </span>
        </h1>

        <p className={`${styles.heroSubtitle} animate-fadeInUp`} style={{ animationDelay: '0.2s' }}>
          Bridging the gap between digital minds and physical bodies
        </p>

        <p className={`${styles.heroDescription} animate-fadeInUp`} style={{ animationDelay: '0.4s' }}>
          Master the cutting-edge technologies powering the next generation of humanoid robots.
          From ROS 2 fundamentals to vision-language-action models, this comprehensive textbook
          guides you through the complete Physical AI stack with hands-on simulations and
          real-world applications.
        </p>

        <div className={`${styles.heroActions} animate-fadeInUp`} style={{ animationDelay: '0.6s' }}>
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
              <path d="M8 6h4M8 10h4M8 14h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Start Reading
          </Link>

          <button
            className={`${styles.heroSecondaryButton} btn-secondary`}
            disabled
            title="GitHub authentication coming soon"
            aria-label="Login with GitHub (Coming soon)"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M10 0C4.477 0 0 4.477 0 10c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-1.025-.014-1.861-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531.103 1.531.103.893 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .268.18.58.688.482A10.019 10.019 0 0020 10c0-5.523-4.477-10-10-10z" />
            </svg>
            Login with GitHub
          </button>
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
