module.exports = async (self, options) => {

  self.apos.app.get('/ideas/download', async (req, res, next) => {

    if (self.apos.permissions.can(req, 'export-idea-overview') === false && req.data.isAdmin === false) {
      console.error('Not allowed to download idea overview');
      req.flash('Not allowed');
      return res.redirect(req.header('Referer') || '/');
    }

    try {
      const ideas = await self.getIdeas(req);
      if(ideas.length <= 0) {
        console.error('No ideas found');
        return res.redirect(req.header('Referer') || '/');
      }
      const csv = self.generateCsv(ideas);

      const date = new Date();
      const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

      res.contentType('text/csv');
      res.header('Content-Disposition', `attachment; filename="Planoverzicht op ${formattedDate}.csv"`);
      res.send(Buffer.from(csv));

    } catch (error) {
      console.error(error);
      res.redirect(req.header('Referer') || '/');
    }
  });

};
