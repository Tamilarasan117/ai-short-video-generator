import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

function CustomLoading({ loading }) {
  return (
    <AlertDialog open={loading}>
      <AlertDialogContent className="bg-white">
        <div className="bg-white flex flex-col items-center my-10 justify-center">
          <Image src={"/progress.gif"} alt="pro" width={100} height={100} />
          <AlertDialogTitle className="mt-4 text-center">
            Generating your video... Do not Refresh
          </AlertDialogTitle>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CustomLoading;
