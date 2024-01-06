export const collisionBetweenTwoBalls = (
  event: Matter.IEventCollision<Matter.Engine>
) => {
  let collisionHappened: {
    collision: boolean;
    body1: Matter.Body | null;
    body2: Matter.Body | null;
  } = {
    collision: false,
    body1: null,
    body2: null,
  };
  let firstCircleBall: string | null = null;

  for (let body of event.source.detector.bodies) {
    if (body.label === "Circle Body" && firstCircleBall !== null) {
      collisionHappened.body2 = body;
      collisionHappened.collision = true;
      break;
    } else {
      collisionHappened.collision = false;
    }

    if (body.label === "Circle Body" && firstCircleBall === null) {
      collisionHappened.body1 = body;
      firstCircleBall = "Circle Body ";
    }
  }

  //   event.source.detector.bodies.forEach((body) => {
  //     if (body.label === "Circle Body" && firstCircleBall !== null) {
  //       console.log("HEPPENING");
  //       collisionHappened = true;
  //     } else {
  //       collisionHappened = false;
  //     }

  //     if (body.label === "Circle Body" && firstCircleBall === null) {
  //       firstCircleBall = "Circle Body ";
  //     }
  //   });

  return collisionHappened;
};
