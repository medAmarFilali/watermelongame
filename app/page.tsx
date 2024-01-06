"use client";

import * as React from "react";
import Matter, { Engine, Render, Bodies, World, Collision } from "matter-js";

export default function Home() {
  const [sideWidth, setSideWidth] = React.useState<number>(0);
  const container = React.useRef<React.ElementRef<"div">>(null);

  const scene = React.useRef<React.ElementRef<"div">>(null);
  const isPressed = React.useRef(false);
  const engine = React.useRef(Engine.create());

  const fruits = React.useMemo(() => {
    return [
      { size: 16, color: "#6f2da8", name: "Grapes" },
      { size: 24, color: "#FFBF34", name: "Mango" },
      { size: 32, color: "#c7372f", name: "Apple" },
      { size: 44, color: "#FFA500", name: "Orange" },
      { size: 56, color: "#C9CC3F", name: "Pear" },
      { size: 78, color: "#7ca55d", name: "Melon" },
      { size: 90, color: "#ff7518", name: "Pumpkin" },
      { size: 102, color: "#D23B68", name: "Watermelon" },
    ];
  }, []);

  const handleCollisionStart = React.useCallback(
    (event: Matter.IEventCollision<Matter.Engine>) => {
      if (
        event.pairs[0].bodyA.label === "Rectangle Body" ||
        event.pairs[0].bodyB.label === "Rectangle Body"
      )
        return;

      const x = event.pairs[0].bodyA.position.x;
      const y = event.pairs[0].bodyA.position.y;
      const fruitIndex = event.pairs[0].bodyA.plugin.index;

      const selectedFruit = fruits[fruitIndex + 1]
        ? fruits[fruitIndex + 1]
        : null;

      console.log(
        "BODY A: " +
          event.pairs[0].bodyA.label +
          ", BODY B: " +
          event.pairs[0].bodyB.label
      );

      if (
        event.pairs[0].bodyA.label === event.pairs[0].bodyB.label &&
        selectedFruit
      ) {
        Matter.Composite.remove(engine.current.world, [
          event.pairs[0].bodyA,
          event.pairs[0].bodyB,
        ]);

        // createBall({
        //   x,
        //   y,
        //   size: selectedFruit.size,
        //   color: selectedFruit.color,
        //   name: selectedFruit.name,
        //   index: fruitIndex + 1,
        // });

        const newBall = Bodies.circle(x, y, selectedFruit.size, {
          mass: 1,
          restitution: 0.2,
          friction: 0.0005,
          label: selectedFruit.name,
          render: {
            fillStyle: selectedFruit.color,
          },
          plugin: {
            size: selectedFruit.size,
            color: selectedFruit.color,
            index: fruitIndex + 1,
          },
        });

        Matter.Composite.add(engine.current.world, newBall);
      }
    },
    [fruits]
  );

  const getRandomNumber = React.useCallback((min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min);
  }, []);

  const handleAddCircle = React.useCallback(
    (e: React.MouseEvent) => {
      const selectedFruit = fruits[getRandomNumber(0, 2)];
      // const selectedFruit = fruits[1];

      const fruitIndex = fruits.findIndex(
        (fruit) => fruit.name === selectedFruit.name
      );

      const newBall = Bodies.circle(
        e.clientX - sideWidth,
        0,
        selectedFruit.size,
        {
          mass: 1,
          restitution: 0.2,
          friction: 0.0005,
          label: selectedFruit.name,
          render: {
            fillStyle: selectedFruit.color,
          },
          plugin: {
            size: selectedFruit.size,
            color: selectedFruit.color,
            index: fruitIndex,
          },
        }
      );
      Matter.Composite.add(engine.current.world, [newBall]);
    },
    [fruits, sideWidth]
  );

  const createBall = React.useCallback(
    (ballObject: {
      x: number;
      y: number;
      size: number;
      color: string;
      name: string;
      index: number;
    }) => {},
    []
  );

  React.useEffect(() => {
    let viewportWidth = document.body.clientWidth;
    const cw = scene?.current?.clientWidth;
    const ch = scene?.current?.clientHeight;

    if (!cw || !ch) return;

    const side = (viewportWidth - cw) / 2;
    setSideWidth(side);

    const render = Render.create({
      element: scene?.current,
      engine: engine.current,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: "transparent",
        showAngleIndicator: true,
      },
    });

    if (cw && ch) {
      Matter.Composite.add(engine.current.world, [
        Bodies.rectangle(cw / 2, -10, cw, 20, { isStatic: true }),
        Bodies.rectangle(-10, ch / 2, 20, ch, { isStatic: true }),
        Bodies.rectangle(cw / 2, ch + 10, cw, 20, { isStatic: true }),
        Bodies.rectangle(cw + 10, ch / 2, 20, ch, { isStatic: true }),
      ]);
    }

    const detector = Matter.Detector.create(engine.current);
    const collisions = Matter.Detector.collisions(detector);
    console.log("COLLISIONS: ", collisions);
    // Matter.Runner.run(engine.current);
    Render.run(render);
    const runner = Matter.Runner.create();

    Matter.Runner.run(runner, engine.current);

    return () => {
      Render.stop(render);
      World.clear(engine?.current?.world, false);
      Matter.Engine.clear(engine?.current);
      Engine.clear(engine?.current);
      render.canvas.remove();
      // render.canvas = null;
      // render.context = null;
      render.textures = {};
    };
  }, []);

  React.useEffect(() => {
    const detector = Matter.Detector.create(engine.current);
    const collisions = Matter.Detector.collisions(detector);

    console.log("COLLISIONS: ", collisions);
  }, []);

  React.useEffect(() => {
    Matter.Events.on(engine.current, "collisionStart", handleCollisionStart);

    return () => {
      Matter.Events.off(engine.current, "collisionStart", handleCollisionStart);
    };
  }, [fruits, handleCollisionStart]);

  return (
    <div className="flex w-full h-screen items-center justify-center">
      <div
        onClick={handleAddCircle}
        ref={scene}
        className="w-[450px] h-[600px]"
      ></div>
    </div>
  );
}
