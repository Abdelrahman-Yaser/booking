# Raise change requests

# **Overview**

**a. A passenger would like to raise a voluntary/involuntary change to his/her original flight joruney and you need to go through the following procedures:**

Info

1. **Raise a request in ChangeReshop API to check the bookable alternative flight solutions**
2. **The passenger selects a solution and is willing to proceed with change process**
3. **Raise a Change Request to create change order**
4. **Invoke OrderDetail API to get the change price**
5. **Invoke Orderpricng API to get final check before payment**
6. **Invoke Ticketing API to issue ticket for the change order**

**b. A passenger would like to raise change of the passenger details/information against the original order and you need to go through the following proceedures:**

Info

1. **Upload file ID using UploadAttachmentFile API and get UploadedFileIds**
2. **Raise a request in ChangePassengerInfo API with file ids**

# **Voluntary Change Procedure**

**When there is a need of voluntary change request from your customers, you will need to raise ChangeReshop API to check the eligibility as well as other alternative and bookable flight solutions. The change price may or may not be displayed at this stage throguh API.** 