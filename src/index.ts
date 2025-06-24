import { Hono } from "hono";
import { stream, streamText } from "hono/streaming";
import { v4 as uuidv4 } from "uuid";
const app = new Hono();
type Vid = {
  id: string;
  title: string;
  duration: string;
  date: string;
};
let videos: Vid[] = [];
app.get("/videos", (c) => {
  c.header("Content-Encoding", "Identity");
  return streamText(c, async (stream) => {
    for (const video of videos) {
      await stream.writeln(JSON.stringify(video));
    }
  });
});
app.post("/videos", async (c) => {
  const { title, duration, date } = await c.req.json();
  const id = uuidv4();
  videos.push({ id, title, duration, date });
  return c.json({
    message: "data posted!",
  });
});
app.get("/videos/:id", async (c) => {
  const id = c.req.param("id");
  const video =  videos.find((vid) => vid.id === id);

  if (video) {
    return c.json(video);
  } else {
    return c.json(
      {
        message: "Video not found",
      },
      404
    );
  }
});
app.put("/videos/:id", async (c) => {
  const id = c.req.param("id");
  const index =  videos.findIndex(vid=>vid.id===id)
const {title,duration,date} = await c.req.json();
  if (index!=-1) {
     videos[index] = {...videos[index],title,duration,date}//this is the first way second way is using mapping
return c.json({
  videos
})
    } else {
    return c.json(
      {
        message: "Video not found",
      },
      404
    );
  }
});
app.patch("/videos/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  const index = videos.findIndex((v) => v.id === id);
  if (index === -1) return c.json({ message: "Not found" }, 404);

  videos[index] = { ...videos[index], ...body };

  return c.json({ message: "Video updated partially" });
});


app.delete("/videos/:id",async(c)=>{
  const id = c.req.param("id")
  videos = videos.filter(vd=>vd.id!=id)
  return c.json({
    message:videos
  })
})
export default app;

