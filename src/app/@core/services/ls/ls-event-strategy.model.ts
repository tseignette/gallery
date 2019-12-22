import { LsStrategy } from "./ls-strategy.model";
import { Folder } from "../../models";

export class LsEventStrategy extends LsStrategy {

  // TODO:
  async continue(fileList: Folder, depth: number) {
    // if (depth === 0) return true;

    // If it is an event, add it to the output but don't continue
    if (depth !== 0 && fileList.isEvent) {
      this.output.addFolder(fileList);
      return false;
    }
    // Otherwise, add medias and continue
    else {
      for (const media of fileList.medias) {
        await this.output.addFile(media.path);
      }
      return true;
    }
  }

}
