import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

export default function PhysicsSkillCloud({ groups }) {
  const boxRef = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);

  useEffect(() => {
    if (!boxRef.current || !canvasRef.current) return;

    // Initialize Engine
    const engine = Matter.Engine.create();
    engineRef.current = engine;
    
    // Set up renderer
    const render = Matter.Render.create({
      element: boxRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        width: boxRef.current.clientWidth,
        height: 400,
        background: '#0a0a0a',
        wireframes: false, // Solid bodies
      }
    });
    renderRef.current = render;

    // Boundaries
    const width = boxRef.current.clientWidth;
    const height = 400;
    
    const ground = Matter.Bodies.rectangle(width / 2, height + 30, width, 60, { isStatic: true });
    const wallLeft = Matter.Bodies.rectangle(-30, height / 2, 60, height, { isStatic: true });
    const wallRight = Matter.Bodies.rectangle(width + 30, height / 2, 60, height, { isStatic: true });
    
    Matter.Composite.add(engine.world, [ground, wallLeft, wallRight]);

    // Flatten skills
    const allSkills = [];
    groups.forEach(([_, items]) => {
      items.forEach(item => allSkills.push(item));
    });

    // Create a body for each skill
    const skillBodies = allSkills.map((skill, index) => {
      // Calculate random starting pos
      const x = Math.random() * (width - 100) + 50;
      const y = -100 - (index * 40); // Drop one by one
      
      // Random color
      const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
      const color = colors[index % colors.length];

      // Approximate text width
      const bodyWidth = skill.length * 10 + 40;
      
      const body = Matter.Bodies.rectangle(x, y, bodyWidth, 40, {
        restitution: 0.6, // Bounciness
        friction: 0.1,
        render: {
          fillStyle: color,
          strokeStyle: '#000',
          lineWidth: 2
        },
        label: skill // Store text in label
      });
      return body;
    });

    Matter.Composite.add(engine.world, skillBodies);

    // Add mouse control
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    Matter.Composite.add(engine.world, mouseConstraint);

    // Keep the mouse in sync with rendering
    render.mouse = mouse;

    // Draw text over bodies
    Matter.Events.on(render, 'afterRender', () => {
      const context = render.context;
      context.font = '14px monospace';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      
      skillBodies.forEach(body => {
        const { position, angle, label } = body;
        context.save();
        context.translate(position.x, position.y);
        context.rotate(angle);
        context.fillStyle = '#fff';
        context.fillText(label, 0, 0);
        context.restore();
      });
    });

    // Start
    Matter.Render.run(render);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Cleanup
    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.World.clear(engine.world);
      Matter.Engine.clear(engine);
      render.canvas = null;
      render.context = null;
      render.textures = {};
    };
  }, [groups]);

  return (
    <div style={{ marginTop: '2rem' }} className="reveal">
      <p style={{ textAlign: 'center', marginBottom: '1rem', color: '#888', fontSize: '0.85rem' }}>
        Interactive Physics Sandbox: Kéo thả các mảnh ghép kỹ năng!
      </p>
      <div 
        ref={boxRef} 
        style={{ 
          width: '100%', 
          height: '400px', 
          border: '4px solid #1f2937', 
          borderRadius: '8px', 
          overflow: 'hidden',
          background: '#0a0a0a'
        }}
      >
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}
