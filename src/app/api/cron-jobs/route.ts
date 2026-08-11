import { updateMiscRepository } from "@/app/database/repository";

export async function GET(request: Request) {
  await updateMiscRepository.updateAll();
  return new Response(`Job was run!`);
}
