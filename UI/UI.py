import remi.gui as gui
from remi.gui import *
from remi import start, App


class Kryptopörssi(App):
    def __init__(self, *args, **kwargs):
        if not 'editing_mode' in kwargs.keys():
            super(Kryptopörssi, self).__init__(*args, static_file_path='./res/')

    def idle(self):
        #idle function called every update cycle
        pass

    def main(self):
        mainContainer = Widget(width=1200, height=800, margin='0px auto', style="position: relative; text-align: center")
        subContainer = Widget(width=1150, height=700, style='position: absolute; left: 25px; top: 80px; background-color: #b6b6b6; display:block', layout_orientation=gui.Widget.LAYOUT_HORIZONTAL)

        #Buying
        vbox = Widget(width=500, height=600, style='display:block; margin: 20px 30px 20px 30px')
        buyLabel = gui.Label("Buying", style='font-size: 20px; margin: 15px 0px')
        vbox.append(buyLabel)
        buyingListView = gui.ListView(style='margin: 20px 30px')
        for i in range(0, 10):
            buyingListView.append(gui.ListItem("asd" + str(100 * i), style='border-bottom: 1px solid #e6e6e6; padding: 8px 0px'))
        vbox.append(buyingListView)
        subContainer.append(vbox,'vbox')

        #Selling
        vbox2 = Widget(width=500, height=600, style='display:block; margin: 20px 30px 20px 30px')
        sellLabel = gui.Label("Selling", style='font-size: 20px; margin: 15px 0px')
        vbox2.append(sellLabel)
        sellingListView = gui.ListView(style='margin: 20px 30px')
        for i in range(0, 10):
            sellingListView.append(gui.ListItem("asd" + str(100 * i), style='border-bottom: 1px solid #e6e6e6; padding: 8px 0px'))
        vbox2.append(sellingListView)
        subContainer.append(vbox2,'vbox2')
        mainContainer.append(subContainer,'subContainer')

        menu=gui.Menu(width='100%', height=33)
        offer = gui.MenuItem('Offer', width=70, height=30, style='padding:3px 0px 0px 0px')
        buy_offer = gui.MenuItem('Buy', width=70, height=30, style='padding:3px 0px 0px 0px')
        buy_offer.set_on_click_listener(self.make_buy_offer_clicked)
        sell_offer = gui.MenuItem('Sell', width=70, height=30, style='padding:3px 0px 0px 0px')
        sell_offer.set_on_click_listener(self.make_sell_offer_clicked)
        offer.append(buy_offer)
        offer.append(sell_offer)
        menu.append(offer)

        menubar = gui.MenuBar(width='100%', height=33)
        menubar.append(menu)
        mainContainer.append(menubar)

        lblTitle = gui.Label("Here you can browse through the buying and selling stock offers and make offers yourself",
                                    style='margin-top: 10px')
        mainContainer.append(lblTitle)

        self.mainContainer = mainContainer
        return self.mainContainer

    def make_buy_offer_clicked(self, widget):
        #replace with implementation
        buy = 'test'

    def make_sell_offer_clicked(self, widget):
        #replace with implementation
        sell = 'test'

if __name__ == "__main__":
    start(Kryptopörssi, standalone=True, height=800, width=1200)
