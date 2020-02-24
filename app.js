function gdocToPDF() {
  var documentRootfolder = DriveApp.getFolderById("GOOGLE_DOC_FOLDER_ID"); // replace this with the ID of the folder that contains the documents you want to convert
  var pdfFolder = DriveApp.getFolderById("PDF_FOLDER_ID"); // replace this with the ID of the folder that the PDFs should be put in.

  var documentRootFiles = documentRootfolder.getFiles();
  while (documentRootFiles.hasNext()) {
    createPDF(documentRootFiles.next().getId(), pdfFolder.getId(), function(
      fileID,
      folderID
    ) {
      if (fileID) createPDFfile(fileID, folderID);
    });
  }
}

function createPDF(fileID, folderID, callback) {
  var templateFile = DriveApp.getFileById(fileID);
  var templateName = templateFile.getName();

  var existingPDFs = DriveApp.getFolderById(folderID).getFiles();

  //in case no files exist
  if (!existingPDFs.hasNext()) {
    return callback(fileID, folderID);
  }

  for (; existingPDFs.hasNext(); ) {
    var existingPDFfile = existingPDFs.next();
    var existingPDFfileName = existingPDFfile.getName();
    var existingPDFfileUpdated = existingPDFfile.getLastUpdated();
    var gDocUpdated = templateFile.getLastUpdated();
    if (existingPDFfileName == templateName + ".pdf") {
      var newerFileExists = gDocUpdated > existingPDFfileUpdated;
      if (newerFileExists) {
        Logger.log(
          "Old PDF exists already. PDF set to trashed, creating new PDF"
        );
        DriveApp.getFolderById(folderID).removeFile(existingPDFfile);
        return callback(fileID, folderID);
      }
      return callback();
    }
  }
  // File does not exist as it escaped the for loop without being found so create the file
  return callback(fileID, folderID);
}

function createPDFfile(fileID, folderID) {
  var templateFile = DriveApp.getFileById(fileID);
  var folder = DriveApp.getFolderById(folderID);
  var theBlob = templateFile.getBlob().getAs("application/pdf");
  var newPDFFile = folder.createFile(theBlob);
  var fileName = templateFile.getName().replace(".", ""); //otherwise filename will be shortened after full stop
  newPDFFile.setName(fileName + ".pdf");
}
