import { LsStrategy } from "./ls-strategy.model";
import { Folder } from "../../models";

export class LsAllStrategy extends LsStrategy {

  async continue(fileList: Folder, depth: number) {
    for (const media of fileList.medias) {
      await this.output.addFile(media.path);
    }

    return true;
  }

}
