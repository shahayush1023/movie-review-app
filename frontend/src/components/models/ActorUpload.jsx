import React, { useState } from "react";
import { createActor } from "../../api/actor";
import ActorForm from "../form/ActorForm";
import ModalContainer from "./ModalContainer";
import { useNotification } from "../../hooks";

export default function ActorUpload({ visible, onClose }) {
  const{updateNotification} = useNotification();
  const [busy,setBusy] = useState(false);

  const handleSubmit = async (data) => {
    setBusy(true);
    const {error,actor} = await createActor(data);
    setBusy(false);
    if(error) return updateNotification('error',error);

    updateNotification('success','Actor created Success');
    onClose();
  };

  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <ActorForm
        onSubmit={!busy ? handleSubmit:null}
        title="Create New Actor"
        btnTitle="Create"
        busy={busy}
      />
    </ModalContainer>
  );
}
